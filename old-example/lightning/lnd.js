import GrpcAction from "./grpc";
import AtplAction from './autopilot';
import {NativeEventEmitter, NativeModules} from "react-native";

const {
	toBuffer,
	secureRandomPassword,
	getKeychainValue,
	setKeychainValue,
	nap
} = require("./helpers");
const PAYMENT_TIMEOUT = 60 * 1000;
class LND {
	constructor() {
		this.isReady = false;
		this.grpc = new GrpcAction(NativeModules, NativeEventEmitter);
	}
	
	async _unlockWallet() {
		try {
			//Check if the user already has a lightning mnemonic & pass.
			const lightningPass = await getKeychainValue({ key: "lightningPass" });
			const lightningMnemonic = await getKeychainValue({ key: "lightningMnemonic" });
			console.log("Lightning Pass:");
			console.log(lightningPass.data.password);
			console.log("Lightning Mnemonic:");
			console.log(lightningMnemonic.data.password);
			if (lightningPass.error === false && lightningPass.data.password) {
				await this.grpc.sendUnlockerCommand('UnlockWallet', {
					walletPassword: toBuffer(lightningPass.data.password),
					recoveryWindow: 0,
				});
				this.isReady = true;
			} else {
				await this._initWallet();
			}
		} catch (e) {
			console.log(e);
			await this._initWallet();
		}
	}
	
	async _initWallet() {
		try {
			const pass = await secureRandomPassword();
			const response = await this.grpc.sendUnlockerCommand('GenSeed');
			const cipherSeedMnemonic = response.cipherSeedMnemonic;
			await this.grpc.sendUnlockerCommand('InitWallet', {
				walletPassword: toBuffer(pass),
				cipherSeedMnemonic,
				recoveryWindow: 250,
			});
			
			//Set the new lightning mnemonic & pass
			await Promise.all([
				setKeychainValue({ key: "lightningMnemonic", value: JSON.stringify(cipherSeedMnemonic) }),
				setKeychainValue({ key: "lightningPass", value: pass }),
				nap(5000)
			]);
			await this.grpc.sendUnlockerCommand('UnlockWallet', {
				walletPassword: toBuffer(pass),
				recoveryWindow: 250,
			});
			this.isReady = true;
		} catch (e) {
			console.log(e);
		}
	}
	
	async start() {
		try {
			await this.grpc.initUnlocker();
			await this._unlockWallet();

			//Attempt to start autopilot.
			await nap(5000);
			const autopilot = new AtplAction(this.grpc);
			autopilot.init();

			return { error: false, data: "" };
		} catch (e) {
			return { error: true, data: e };
		}
	}
	
	async getInfo() {
		try {
			if (!this.isReady || !this.grpc) await this.start();
			if (!this.isReady) return { error: true, data: "Unable to initialize LND." };
			const getInfoResponse = await this.grpc.sendCommand('getInfo');
			return { error: false, data: getInfoResponse };
		} catch (e) {
			return { error: true, data: e };
		}
	}
	
	async getTransactions() {
		try {
			if (!this.isReady || !this.grpc) await this.start();
			const response = await this.grpc.sendCommand('GetTransactions');
			return { error: false, data: response };
		} catch (e) {
			return { error: true, data: e };
		}
	}
	
	async getInboundCapacity() {
		try {
			if (!this.isReady || !this.grpc) await this.start();
			const getChannelBalanceResponse = await this.grpc.sendCommand('ListChannels');
			let remoteBalance = 0;
			await Promise.all(getChannelBalanceResponse.channels.map((channel) => {
				try {if (channel.remoteBalance) remoteBalance = channel.remoteBalance + remoteBalance;} catch (e) {}
			}));
			return { error: false, data: remoteBalance || 0 };
		} catch (e) {
			return { error: true, data: e };
		}
	}
	
	async connectToPeer({ peer = "" } = {}) {
		const failure = (data = "") => ({ error: true, data });
		try {
			if (!this.isReady || !peer) return failure("Unable to connect to peer");
			try {
				const pubkey = peer.split("@")[0];
				const host = peer.split("@")[1];
				await this.grpc.sendCommand("connectPeer", {
					addr: { host, pubkey },
				});
				return { error: false, data: `Connected to ${pubkey}@${host}`};
			} catch (err) {
				console.log("Connecting to peer failed", err);
				return failure(err);
			}
		} catch (e) {
			console.log(e);
			return { error: true, data: e };
		}
	}
	
	async getPeers() {
		try {
			const response = await this.grpc.sendCommand('listPeers');
			return { error: false, data: response };
		} catch (e) {
			console.log(e);
			return({ error: true, data });
		}
	}
	
	async subscribeTransactions({ onReceive = () => null, onError = () => null } = {}) {
		const failure = (data = "") => onError({ error: true, data });
		try {
			if (!this.isReady) return failure("Unable to initialize LND.");
			try {
				const stream = this.grpc.sendStreamCommand("subscribeTransactions");
				stream.on("data", data => {try {onReceive(data);} catch (e) {onError(e);}});
				stream.on('end', () => ({ error: false, data: "Subscribed to transactions." }));
				stream.on("error", (data) => onError(data));
				stream.on("status", status => console.log(`Transactions update: ${status}`));
			} catch (e) {failure(e);}
			return { error: false, data: "Subscribed to transactions." };
		} catch (e) {
			failure(e);
		}
	}
	
	async stop() {
		try {
			await this.grpc.sendCommand('stopDaemon');
			this.isReady = false;
		} catch (e) {}
	}
	
	/**
	 * Send the amount specified in the invoice as a lightning transaction and
	 * display the wait screen while the payment confirms.
	 * This action can be called from a view event handler as does all
	 * the necessary error handling and notification display.
	 * @return {Promise<undefined>}
	 */
	async payLightning(invoice = "") {
		return new Promise(async (resolve) => {
			const failure = (data = "") => resolve({ error: true, data });
			if (!this.isReady) return failure();
			const timeout = setTimeout(() => {
				return failure();
			}, PAYMENT_TIMEOUT);
			try {
				const stream = this.grpc.sendStreamCommand("SendPayment");
				stream.on("data", data => {
					let error = false;
					try {error = data.paymentError;} catch (e) {}
					if (error) resolve({error: true, data: `Lightning payment error: ${data.paymentError}`});
					resolve({ error: false, data: "Success!" });
				});
				stream.on("error", () => failure("Lightning payment failed!"));
				stream.write(JSON.stringify({paymentRequest: invoice}), 'utf8');
			} catch (e) {
				console.log(e);
				failure("Lightning payment failed!");
			} finally {
				try {clearTimeout(timeout);} catch (e) {}
			}
		});
	}
	
	//TODO: Not working
	async getBackup() {
		return new Promise(resolve => {
			const failure = (data = "") => resolve({ error: true, data });
			if (!this.isReady) return failure();
			const timeout = setTimeout(() => {
				return failure();
			}, PAYMENT_TIMEOUT);
			try {
				const stream = this.grpc.sendStreamCommand("SubscribeChannelBackups");
				stream.on("data", data => {
					resolve({error: false, data});
				});
				stream.on("error", () => failure("Backup Failed!"));
				stream.on('status', status => console.log(`Channel backup status: ${status}`));
			} catch (e) {
				console.log(e);
				return failure("Backup Failed!");
			} finally {
				try {clearTimeout(timeout);} catch (e) {}
			}
		});
	}
	
	async getAddress() {
		const failure = (data = "") => ({ error: true, data });
		try {
			if (!this.isReady) return failure();
			const newAddressResponse = await this.grpc.sendCommand('newAddress', {type: "p2pkh"});
			if (newAddressResponse.address) return { error: false, data: newAddressResponse.address };
			return failure("Unable to generate address.");
		} catch (e) {
			console.log(e);
			return failure(e);
		}
	}
	
	async addInvoice({ amount = 0, memo = "", expiry = 172800 } = {}) {
		const failure = (data = "") => ({ error: true, data });
		try {
			if (!this.isReady) return failure();
			const response = await this.grpc.sendCommand('addInvoice', {
				value: amount,
				memo,
				expiry,
				private: true,
			});
			const invoice = response.paymentRequest;
			return { error: false, data: invoice };
		} catch (e) {
			console.log(e);
			return failure(e);
		}
	}
	
	async getWalletBalance() {
		const failure = (data = "") => ({ error: true, data });
		try {
			if (!this.isReady) return failure();
			const response = await this.grpc.sendCommand("WalletBalance");
			return {
				error: false,
				data: {
					totalBalance: response.totalBalance || 0,
					confirmedBalance: response.confirmedBalance || 0,
					unconfirmedBalance: response.unconfirmedBalance || 0
				}
			};
		} catch (e) {
			console.log(e);
			return failure(e);
		}
	}
	
	async getChannelBalance() {
		const failure = (data = "") => ({ error: true, data });
		try {
			if (!this.isReady) return failure();
			const response = await this.grpc.sendCommand("ChannelBalance");
			return {
				error: false,
				data: {
					balance: response.balance || 0,
					pendingOpenBalance: response.pendingOpenBalance || 0
				}
			};
		} catch (e) {
			console.log(e);
			return failure(e);
		}
	}
	
	async decodePaymentRequest(payReq = "") {
		const failure = (data = "") => ({ error: true, data });
		if (!this.isReady) return failure();
		const request = { payReq };
		try {
			const response = await this.grpc.sendCommand("DecodePayReq", request);
			return { error: false, data: response};
		} catch (e) {
			console.log(e);
			return failure(e);
		}
	}
	
	async logAvailableData() {
		if (!this.isReady) return { error: true, data: "" };
		try {
			console.log("Attempting to get info...");
			const getInfoResponse = await this.grpc.sendCommand('getInfo');
			console.log("Logging GetInfoResponse: ");
			console.log(getInfoResponse);
			
			const getWalletBalanceResponse = await this.grpc.sendCommand('WalletBalance');
			console.log("Logging getWalletBalanceResponse: ");
			console.log(getWalletBalanceResponse);
			
			const getChannelBalanceResponse = await this.grpc.sendCommand('ChannelBalance');
			console.log("Logging getChannelBalanceResponse: ");
			console.log(getChannelBalanceResponse);
			
			const getTransactionsResponse = await this.grpc.sendCommand('GetTransactions');
			console.log("Logging getTransactionsResponse: ");
			console.log(getTransactionsResponse);
			
			const listPeersResponse = await this.grpc.sendCommand('ListPeers');
			console.log("Logging listPeersResponse: ");
			console.log(listPeersResponse);
			
			const pendingChannelsResponse = await this.grpc.sendCommand('PendingChannels');
			console.log("Logging pendingChannelsResponse: ");
			console.log(pendingChannelsResponse);
			
			const listChannelsResponse = await this.grpc.sendCommand('ListChannels');
			console.log("Logging listChannelsResponse: ");
			console.log(listChannelsResponse);
			
			const listPaymentsResponse = await this.grpc.sendCommand('ListPayments');
			console.log("Logging listPaymentsResponse: ");
			console.log(listPaymentsResponse);
		} catch (e) {
			console.log(e);
		}
	}
}

module.exports = new LND();
