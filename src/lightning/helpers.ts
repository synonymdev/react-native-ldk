// import * as Keychain from "react-native-keychain";
// import "../../shim";
// import { randomBytes } from "react-native-randombytes";
//
// const setKeychainValue = async ({ key = "", value = "" } = {}) => {
//     return new Promise(async (resolve) => {
//         try {
//             const result = await Keychain.setGenericPassword(key, value, key);
//             resolve({ error: false, data: result });
//         } catch (e) {
//             resolve({ error: true, data: e });
//             console.log(e);
//         }
//     });
// };
//
// const getKeychainValue = async ({ key = "" } = {}) => {
//     return new Promise(async (resolve) => {
//         try {
//             const result = await Keychain.getGenericPassword(key);
//             resolve({ error: false, data: result });
//         } catch (e) {
//             resolve({ error: true, data: e });
//             console.log(e);
//         }
//     });
// };
//
// //WARNING: This will wipe the specified key from storage
// const resetKeychainValue = async ({ key = "" } = {}) => {
//     return new Promise(async (resolve) => {
//         try {
//             const result = await Keychain.resetGenericPassword(key);
//             resolve({ error: false, data: result });
//         } catch (e) {
//             resolve({ error: true, data: e });
//             console.log(e);
//         }
//     });
// };
//
/**
 * Split '_' separated words and convert to uppercase
 * @param  {string} value     The input string
 * @param  {string} separator The separator to be used
 * @param  {string} split     The split char that concats the value
 * @return {string}           The words conected with the separator
 */
const toCaps = (value: string = '', separator: string = ' ', split: string = '-'): string => {
  return value
    .split(split)
    .map((v) => v.charAt(0).toUpperCase() + v.substring(1))
    .reduce((a, b) => `${a}${separator}${b}`);
};
//
// /**
//  * Convert a string to bytes
//  * @param  {string} str The input string in utf8
//  * @return {Buffer}     The output bytes
//  */
// const toBuffer = str => {
//     if (typeof str !== 'string') {
//         throw new Error('Invalid input!');
//     }
//     return Buffer.from(str, 'utf8');
// };
//
// /**
//  * Generate a random hex encoded 256 bit entropy wallet password.
//  * @return {Promise<string>} A hex string containing some random bytes
//  */
// const secureRandomPassword = async () => {
//     const bytes = await randomBytes(32);
//     return Buffer.from(bytes.buffer).toString('hex');
// };
//
// /**
//  * Check if the HTTP status code signals is successful
//  * @param  {Object} response The fetch api's response object
//  * @return {Object}          The response object if successful
//  */
// const checkHttpStatus = response => {
//     if (response.status >= 200 && response.status < 300) {
//         return response;
//     } else {
//         throw new Error(response.statusText);
//     }
// };
//
// /**
//  * A polling utility that can be used to poll apis. If the api returns
//  * a truthy value this utility will stop polling. Errors thrown by the
//  * api are just thrown up to the caller to handle.
//  * @param {Function} api     The api wrapped in an asynchronous function
//  * @param {number} interval  The time interval to wait between polls
//  * @param {number} retries   The number of retries to poll the api
//  * @return {Promise<Object>} The return value of the api
//  */
// const poll = async (api, interval = RETRY_DELAY, retries = Infinity) => {
//     while (retries--) {
//         const response = await api();
//         if (response) return response;
//         await nap(interval);
//     }
//     throw new Error('Maximum retries for polling reached');
// };
//
// /**
//  * Take a nice little nap :)
//  * @param  {number} ms The amount of milliseconds to sleep
//  * @return {Promise<undefined>}
//  */
// const nap = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
//
//
module.exports = {
  // setKeychainValue,
  // getKeychainValue,
  // resetKeychainValue,
  toCaps
  // toBuffer,
  // secureRandomPassword,
  // checkHttpStatus,
  // poll,
  // nap
};
