import Keychain from 'react-native-keychain';

/**
 * Use Keychain to save LDK seed.
 * @param {string} [key]
 * @param {string} seed
 */
export const setSeed = async (
	key = 'ldkseed',
	seed = dummyRandomSeed(),
): Promise<boolean> => {
	try {
		await Keychain.setGenericPassword(key, seed, { service: key });
		return true;
	} catch {
		return false;
	}
};

/**
 * Use Keychain to retrieve LDK seed.
 * @param {string} [key]
 * @returns {Promise<string>}
 */
export const getSeed = async (key = 'ldkseed'): Promise<string> => {
	try {
		let result = await Keychain.getGenericPassword({ service: key });
		if (!result) {
			return '';
		}
		return result && result?.password ? result?.password : '';
	} catch (e) {
		return '';
	}
};

const shuffle = (array: string[]): string[] => {
	let currentIndex = array.length,
		randomIndex;
	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
};

export const dummyRandomSeed = (): string => {
	if (!__DEV__) {
		throw new Error('Use random bytes instead of dummyRandomSeed');
	}

	const bytes =
		'8a bd ac 77 55 2a 6e a6 0a 47 2f bf 6c d8 d5 af b4 78 19 96 a4 d2 e2 81 7c ae 6e 2b 38 ae 56 fd';

	return shuffle(bytes.split(' ')).join('');
};
