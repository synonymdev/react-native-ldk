import queryString from 'query-string';

export default class ClightningRPC {
	destroyed: boolean = false;
	macaroon: string;
	host: string;
	port: number;
	headers: {};

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
			'Content-type': 'application/json',
			macaroon: Buffer.from(this.macaroon, 'hex').toString('base64'),
		};
	}

	getInfo(): Promise<any> {
		return this._get({ path: '/v1/getinfo' });
	}

	pay(body): Promise<any> {
		return this._post({ path: '/v1/pay', body });
	}

	genInvoice(body): Promise<any> {
		return this._post({ path: '/v1/invoice/genInvoice', body });
	}

	newAddr(): Promise<any> {
		return this._get({ path: '/v1/newaddr' });
	}

	listPeers(): Promise<any> {
		return this._get({ path: '/v1/peer/listPeers' });
	}

	openChannel(body): Promise<any> {
		return this._post({ path: '/v1/channel/openChannel', body });
	}

	destroy(): void {
		this.destroyed = true;
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

		const res = await fetch(fullPath, {
			method,
			headers: this.headers,
			body: body ? body : undefined,
		});

		if (res.status !== 200 && res.status !== 201) {
			let jsonBody: any;
			try {
				jsonBody = await res.json();
			} catch (e) {}
			console.info('jsonBody', jsonBody);
			if (jsonBody) {
				throw new Error(`LC: ${JSON.stringify(jsonBody)}`);
			}
			throw new Error('LC: Unexpected status code ' + res.status);
		}

		return res.json();
	}
}
