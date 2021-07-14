import { NativeEventEmitter, NativeModules, NativeModulesStatic, Platform } from 'react-native';
import base64 from 'base64-js';
import {
	EGrpcStreamMethods,
	EGrpcSyncMethods,
	EStreamEventTypes,
	TNativeStreamResponse
} from './utils/types';
import { err, ok, Result } from './utils/result';
import { ss_lnrpc } from './index';

class GrpcAction {
	private readonly lnd: NativeModulesStatic;
	readonly lndEvent: NativeEventEmitter;
	private static streamCounter = 0;

	constructor(lndModule: NativeModulesStatic) {
		this.lnd = lndModule;
		// TODO try expose the iOS event emitter in the same native module.
		this.lndEvent =
			Platform.OS === 'ios'
				? new NativeEventEmitter(NativeModules.LightningEventEmitter)
				: new NativeEventEmitter(NativeModules.ReactNativeLightning);
	}

	/**
	 * Throws an error if LND is not in a state to be queried via GRPC
	 * @throws Error
	 * @returns {Promise<void>}
	 */
	async checkGrpcReady(): Promise<void> {
		const state = await this.getStateCommand();

		if (state === ss_lnrpc.WalletState.WAITING_TO_START) {
			throw new Error('LND not started');
		}
	}

	/**
	 * Wrapper function for querying the current state of LND
	 * @returns {Promise<ss_lnrpc.WalletState>}
	 */
	async getStateCommand(): Promise<ss_lnrpc.WalletState> {
		const serialisedReq = base64.fromByteArray(
			ss_lnrpc.GetStateRequest.encode(ss_lnrpc.GetStateRequest.create()).finish()
		);
		const { data: serializedResponse } = await this.lnd.sendCommand(
			EGrpcSyncMethods.GetState,
			serialisedReq
		);
		if (serializedResponse === undefined) {
			throw new Error('Unable to determine LND state. Missing response.');
		}

		return ss_lnrpc.GetStateResponse.decode(base64.toByteArray(serializedResponse)).state;
	}

	/**
	 * Wrapper function to execute calls to the lnd grpc client.
	 * @param method
	 * @return {Promise<Uint8Array>}
	 * @param buffer
	 */
	async sendCommand(method: EGrpcSyncMethods, buffer: Uint8Array): Promise<Uint8Array> {
		if (method !== EGrpcSyncMethods.GetState) {
			await this.checkGrpcReady(); // Throws an exception if LND is not ready to be queried via grpc
		}

		const serialisedReq = base64.fromByteArray(buffer);
		const { data: serializedResponse } = await this.lnd.sendCommand(method, serialisedReq);
		if (serializedResponse === undefined) {
			throw new Error('Missing response');
		}

		return base64.toByteArray(serializedResponse);
	}

	private generateStreamId(): string {
		GrpcAction.streamCounter = GrpcAction.streamCounter + 1;
		return String(GrpcAction.streamCounter);
	}

	sendStreamCommand(
		method: EGrpcStreamMethods,
		buffer: Uint8Array,
		onUpdate: (res: Result<Uint8Array>) => void,
		onDone: (res: Result<boolean>) => void
	): void {
		try {
			// Throws an exception if LND is not ready to be queried via grpc
			this.checkGrpcReady()
				.then(() => {
					const serialisedReq = base64.fromByteArray(buffer);
					const streamId = this.generateStreamId();
					this.lnd.sendStreamCommand(method, streamId, serialisedReq);

					this.lndEvent.addListener(
						EStreamEventTypes.StreamEvent,
						(res: TNativeStreamResponse | undefined) => {
							if (res && res.streamId === streamId) {
								if (res.error === 'EOF') {
									onDone(ok(true));
									return;
								} else if (res.error) {
									// Not done but received an error update
									onUpdate(err(new Error(res.error)));
								}

								if (res.data) {
									onUpdate(ok(base64.toByteArray(res.data)));
								}
							}
						}
					);
				})
				.catch((e) => {
					onDone(err(e));
				});
		} catch (e) {
			onDone(err(e));
		}
	}
}

export default GrpcAction;
