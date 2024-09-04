import queryString from 'query-string';

export default class ClightningRPC {
	destroyed: boolean = false;
	rune: string;
	host: string;
	port: number;
	headers: {};

	constructor(opts: any = {}) {
		if (!opts.rune) {
			throw new Error('rune is required');
		}
		if (!opts.host) {
			throw new Error('host is required');
		}
		if (!opts.port) {
			throw new Error('port is required');
		}

		this.rune = opts.rune;
		this.host = opts.host;
		this.port = opts.port;

		this.headers = {
			Accept: 'application/json',
			'Content-type': 'application/json',
			Rune: this.rune,
		};
	}

	getInfo(body?: any): Promise<any> {
		return this._post({ path: '/v1/getinfo', body });
	}

	pay(body?: any): Promise<any> {
		return this._post({ path: '/v1/pay', body });
	}

	genInvoice(body?: any): Promise<any> {
		return this._post({ path: '/v1/invoice/genInvoice', body });
	}

	newAddr(body?: any): Promise<any> {
		return this._post({ path: '/v1/newaddr', body });
	}

	listPeers(body?: any): Promise<any> {
		return this._post({ path: '/v1/listpeers', body });
	}

	fundchannel(body?: any): Promise<any> {
		return this._post({ path: '/v1/fundchannel', body });
	}

	destroy(): void {
		this.destroyed = true;
	}

	async _post({ path, body }: { path: string; body?: object }): Promise<any> {
		const jsonBody = JSON.stringify(body || {});
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

	async _request(opts: any): Promise<any> {
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
