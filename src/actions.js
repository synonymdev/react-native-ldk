export const payLightning = async ({ lnd = {}, uri = "" } = {}) => {
	try {
		const decodeResponse = await lnd.decodePaymentRequest(uri);
		console.log(decodeResponse);
		const response = await lnd.payLightning(uri);
		console.log('Logging PayLightning Response...');
		console.log(response);
		return response;
	} catch (e) {
		console.log(e);
	}
};

export const getAllInfo = async ({ lnd = {} } = {}) => {
	try {
		return await lnd.logAvailableData();
	} catch (e) {
		console.log(e);
	}
};

export const getInfo = async ({ lnd = {} } = {}) => {
	try {
		const response = await lnd.getInfo();
		console.log(response);
		return response;
	} catch (e) {
		console.log(e);
	}
};

export const getAddress = async ({ lnd = {} } = {}) => {
	try {
		const response = await lnd.getAddress();
		console.log(response);
		return response;
	} catch (e) {
		console.log(e);
	}
};

export const addInvoice = async ({ lnd = {}, amount = 0 } = {}) => {
	try {
		const response = await lnd.addInvoice({ amount });
		if (!response.error) {
			//const uri = `lightning:${response.data}`;
		}
		console.log(response);
		return response;
	} catch (e) {
		console.log(e);
	}
};

export const getBackup = async ({ lnd = {} } = {}) => {
	try {
		const response = await lnd.getBackup();
		console.log(response);
		return response;
	} catch (e) {
		console.log(e);
	}
};

export const connectToPeer = async ({ lnd = {} } = {}) => {
	try {
		const response = await lnd.connectToPeer();
		console.log(response);
		return response;
	} catch (e) {
		console.log(e);
	}
};

export const getPeers = async ({ lnd = {} } = {}) => {
	try {
		const response = await lnd.getPeers();
		console.log(response);
		return response;
	} catch (e) {
		console.log(e);
	}
};

export const getWalletBalance = async ({ lnd = {} } = {}) => {
	try {
		const response = await lnd.getWalletBalance();
		console.log(response);
		return response;
	} catch (e) {
		console.log(e);
	}
};

export const getChannelBalance = async ({ lnd = {} } = {}) => {
	try {
		const response = await lnd.getChannelBalance();
		console.log(response);
		return response;
	} catch (e) {
		console.log(e);
	}
};

export const getTransactions = async ({ lnd = {} } = {}) => {
	try {
		const response = await lnd.getTransactions();
		console.log(response);
		return response;
	} catch (e) {
		console.log(e);
	}
};

export const getInboundCapacity = async ({ lnd = {} } = {}) => {
	try {
		const response = await lnd.getInboundCapacity();
		console.log(response);
		return response;
	} catch (e) {
		console.log(e);
	}
};
