import queryString from 'query-string';

export default class LNDRPC {
	destroyed: boolean = false;
	macaroon: string;
	host: string;
	port: number;
	headers: {};
	// requests: Set<any>;

	constructor(opts: any = {}) {
		if (!opts.macaroon) {
			throw new Error('macaroon is required');
		}
		if (!opts.host) {
			throw new Error('host is required');
		}
		if (!opts.port) {
			throw new Error('port is required');
		}

		this.macaroon = opts.macaroon;
		this.host = opts.host;
		this.port = opts.port;

		this.headers = {
			Connection: 'Keep-Alive',
			'Content-type': 'application/json',
			'Grpc-Metadata-macaroon': this.macaroon,
		};

		// this.requests = new Set()
	}

	getInfo(): Promise<any> {
		return this._get({ path: '/v1/getinfo' });
	}

	decodePayReq(paymentRequest): Promise<any> {
		return this._get({ path: '/v1/payreq/' + paymentRequest });
	}

	listChannels(params = {}): Promise<any> {
		return this._get({ path: '/v1/channels', params });
	}

	sendPaymentSync(body): Promise<any> {
		return this._post({ path: '/v1/channels/transactions', body });
	}

	addInvoice(body): Promise<any> {
		return this._post({ path: '/v1/invoices', body });
	}

	newAddress(): Promise<any> {
		return this._get({ path: '/v1/newaddress' });
	}

	listPeers(): Promise<any> {
		return this._get({ path: '/v1/peers' });
	}

	openChannelSync(body): Promise<any> {
		return this._post({ path: '/v1/channels', body });
	}

	listInvoices(params): Promise<any> {
		return this._get({ path: '/v1/invoices', params });
	}

	destroy(): void {
		this.destroyed = true;
		// for (const req of this.requests) req.destroy()
	}

	async _post({ path, body }): Promise<any> {
		const jsonBody = JSON.stringify(body);
		return await this._request({ method: 'POST', path, body: jsonBody });
	}

	async _get({
		path,
		params = {},
	}: {
		path: string;
		params?: object;
	}): Promise<any> {
		const pathWithParams = path + '?' + queryString.stringify(params ?? {});
		return await this._request({ method: 'GET', path: pathWithParams });
	}

	async _request(opts): Promise<any> {
		const { path, body, method } = opts;
		const fullPath = 'http://' + this.host + ':' + this.port + path;

		const req = fetch(fullPath, {
			method,
			headers: this.headers,
			body: body ? body : undefined,
		});

		// this.requests.add(req)

		try {
			const res = await req;
			if (res.status !== 200) {
				let jsonBody: any;
				try {
					jsonBody = await res.json();
				} catch (e) {}
				console.info('jsonBody', jsonBody);
				if (jsonBody) {
					throw new Error(`LND: ${jsonBody.message}; code: ${jsonBody.code}`);
				}
				throw new Error('LND: Unexpected status code ' + res.status);
			}
			return res.json();
		} finally {
			// this.requests.delete(req)
		}
	}
}
