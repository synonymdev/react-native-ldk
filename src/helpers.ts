export const stringToBytes = (str: string): Uint8Array => {
	const charList = str.split('');
	const uintArray = [];
	for (let i = 0; i < charList.length; i++) {
		uintArray.push(charList[i].charCodeAt(0));
	}
	return new Uint8Array(uintArray);
};

/**
 * Split '_' separated words and convert to uppercase
 * @param  {string} value     The input string
 * @param  {string} separator The separator to be used
 * @param  {string} split     The split char that concats the value
 * @return {string}           The words conected with the separator
 */
export const toCaps = (
	value: string = '',
	separator: string = ' ',
	split: string = '-'
): string => {
	return value
		.split(split)
		.map((v) => v.charAt(0).toUpperCase() + v.substring(1))
		.reduce((a, b) => `${a}${separator}${b}`);
};
