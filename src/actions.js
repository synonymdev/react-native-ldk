export const payLightning = async ({ lnd = {}, uri = "", log = true } = {}) => {
	try {
		const decodeResponse = await lnd.decodePaymentRequest(uri);
		console.log(decodeResponse);
		const response = await lnd.payLightning(uri);
		if (log) console.log(response);
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

export const getInfo = async ({ lnd = {}, log = true } = {}) => {
	try {
		const response = await lnd.getInfo();
		if (log) console.log(response);
		return response;
	} catch (e) {
		console.log(e);
	}
};

export const getAddress = async ({ lnd = {}, log = true } = {}) => {
	try {
		const response = await lnd.getAddress();
		if (log) console.log(response);
		return response;
	} catch (e) {
		console.log(e);
	}
};

export const addInvoice = async ({ lnd = {}, amount = 0 , log = true} = {}) => {
	try {
		const response = await lnd.addInvoice({ amount });
		if (log) console.log(response);
		return response;
	} catch (e) {
		console.log(e);
	}
};

export const getBackup = async ({ lnd = {}, log = true } = {}) => {
	try {
		const response = await lnd.getBackup();
		if (log) console.log(response);
		return response;
	} catch (e) {
		console.log(e);
	}
};

export const connectToPeer = async ({ lnd = {}, peer = "", log = true } = {}) => {
	try {
		const response = await lnd.connectToPeer({ peer });
		if (log) console.log(response);
		return response;
	} catch (e) {
		console.log(e);
	}
};

export const getPeers = async ({ lnd = {}, log = true } = {}) => {
	try {
		const response = await lnd.getPeers();
		if (log) console.log(response);
		return response;
	} catch (e) {
		console.log(e);
	}
};

export const getWalletBalance = async ({ lnd = {}, log = true } = {}) => {
	try {
		const response = await lnd.getWalletBalance();
		if (log) console.log(response);
		return response;
	} catch (e) {
		console.log(e);
	}
};

export const getChannelBalance = async ({ lnd = {}, log = true } = {}) => {
	try {
		const response = await lnd.getChannelBalance();
		if (log) console.log(response);
		return response;
	} catch (e) {
		console.log(e);
	}
};

export const getTransactions = async ({ lnd = {}, log = true } = {}) => {
	try {
		const response = await lnd.getTransactions();
		if (log) console.log(response);
		return response;
	} catch (e) {
		console.log(e);
	}
};

export const getInboundCapacity = async ({ lnd = {}, log = true } = {}) => {
	try {
		const response = await lnd.getInboundCapacity();
		if (log) console.log(response);
		return response;
	} catch (e) {
		console.log(e);
	}
};
