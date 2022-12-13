export type Result<T> = Ok<T> | Err<T>;

export class Ok<T> {
	public constructor(public readonly value: T) {}

	public isOk(): this is Ok<T> {
		return true;
	}

	public isErr(): this is Err<T> {
		return false;
	}
}

export class Err<T> {
	public constructor(
		public readonly error: Error,
		public readonly code: string = '',
	) {
		// Don't console log for unit tests or if we're not in dev mode
		if (process.env.JEST_WORKER_ID === undefined && __DEV__) {
			// console.info(error);
		}
	}

	public isOk(): this is Ok<T> {
		return false;
	}

	public isErr(): this is Err<T> {
		return true;
	}
}

/**
 * Construct a new Ok result value.
 */
export const ok = <T>(value: T): Ok<T> => new Ok(value);

/**
 * Construct a new Err result value.
 */
export const err = <T>(error: Error | string | any): Err<T> => {
	if (typeof error === 'string') {
		return new Err(new Error(error), fallBackErrorCode(error));
	}

	return new Err(error, error.code || fallBackErrorCode(error.message));
};

/**
 * Creates a slug type code for default error.code
 * @param text
 * @returns {string}
 */
const fallBackErrorCode = (text: string): string => {
	if (!text) {
		return '';
	}
	return text
		.toLowerCase()
		.replace(/[^\w ]+/g, '')
		.replace(/ +/g, '-');
};
