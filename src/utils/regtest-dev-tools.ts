const POLAR_USER = 'polaruser';
const POLAR_PASS = 'polarpass';
const POLAR_HOST = '127.0.0.1:18443';

//NOTE: all of these functions should be replaced

/**
 * Temp function. Needs to be replaced with random bytes.
 * @returns {string}
 */
export const dummyRandomSeed = (): string => {
	if (!__DEV__) {
		throw new Error('Use random bytes instead of dummyRandomSeed');
	}

	const bytes =
		'8a bd ac 77 55 2a 6e a6 0a 47 2f bf 6c d8 d5 af b4 78 19 96 a4 d2 e2 81 7c ae 6e 2b 38 ae 56 fd';

	return shuffle(bytes.split(' ')).join('');
};

/**
 * Fetches json from bitcoind RPC
 * @param method
 * @param params
 * @returns {Promise<any>}
 */
const bitcoinRPC = async (method: string, params: any[]) => {
	const data = { jsonrpc: '1.0', id: 'todo', method, params };
	const res = await fetch(`http://${POLAR_USER}:${POLAR_PASS}@${POLAR_HOST}/`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
	const json = await res.json();
	if (json.error) {
		throw new Error(json.error);
	}

	return json.result;
};

export const regtestBestBlock = async (): Promise<{
	bestblockhash: string;
	blocks: number;
}> => {
	await regtestGenesisBlockHash();
	const { bestblockhash, blocks } = await bitcoinRPC('getblockchaininfo', []);
	return { bestblockhash, blocks };
};

export const regtestGenesisBlockHash = async (): Promise<string> => {
	const hash = await bitcoinRPC('getblockhash', [0]);
	return hash;
};

export const regtestBlockHeaderHex = async (blockHash: string): Promise<string> => {
	return await bitcoinRPC('getblock', [blockHash, false]);
};

const shuffle = (array: string[]) => {
	let currentIndex = array.length,
		randomIndex;
	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
};
