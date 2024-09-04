export default class EclairRPC {
	destroyed: boolean = false;
	password: string;
	host: string;
	port: number;
	headers: {};

	constructor(opts: any = {}) {
		if (!opts.password) {
			throw new Error('password is required');
		}
		if (!opts.host) {
			throw new Error('host is required');
		}
		if (!opts.port) {
			throw new Error('port is required');
		}

		this.password = opts.password;
		this.host = opts.host;
		this.port = opts.port;

		const base64auth = Buffer.from(`:${this.password}`).toString('base64');

		this.headers = {
			Connection: 'Keep-Alive',
			Authorization: `Basic ${base64auth}`,
		};
	}

	getInfo(): Promise<any> {
		return this._post({ path: '/getinfo' });
	}

	peers(): Promise<any> {
		return this._post({ path: '/peers' });
	}

	onchainbalance(): Promise<any> {
		return this._post({ path: '/onchainbalance' });
	}

	open(body): Promise<any> {
		console.info('openChannel', body);
		return this._post({ path: '/open', body });
	}

	channel(body): Promise<any> {
		return this._post({ path: '/channels', body });
	}

	pay(body): Promise<any> {
		return this._post({ path: '/payinvoice', body });
	}

	createinvoice(body): Promise<any> {
		return this._post({ path: '/createinvoice', body });
	}

	sendonchain(body): Promise<any> {
		return this._post({ path: '/sendonchain', body });
	}

	getnewaddress(): Promise<any> {
		return this._post({ path: '/getnewaddress' });
	}

	destroy(): void {
		this.destroyed = true;
	}

	async _post({ path, body }: { path: string; body?: object }): Promise<any> {
		return await this._request({ method: 'POST', path, body });
	}

	async _request(opts): Promise<any> {
		const { path, method, body = {} } = opts;
		const fullPath = 'http://' + this.host + ':' + this.port + path;

		const formData = new FormData();
		for (const [key, value] of Object.entries(body)) {
			formData.append(key, String(value));
		}

		const res = await fetch(fullPath, {
			method,
			headers: this.headers,
			body: Object.keys(body).length > 0 ? formData : undefined,
		});

		if (res.status !== 200 && res.status !== 201) {
			let jsonBody: any;
			try {
				jsonBody = await res.json();
			} catch (e) {}
			if (jsonBody) {
				throw new Error(`Eclair: ${JSON.stringify(jsonBody)}`);
			}
			throw new Error('Eclair: Unexpected status code ' + res.status);
		}

		return res.json();
	}
}
