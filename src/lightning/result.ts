export type Result<T, E> = Ok<T, E> | Err<T, E>;

export class Ok<T, E> {
	public constructor(public readonly value: T) {}

	public isOk(): this is Ok<T, E> {
		return true;
	}

	public isErr(): this is Err<T, E> {
		return false;
	}
}

export class Err<T, E> {
	public constructor(public readonly error: E) {
		console.error(error);
	}

	public isOk(): this is Ok<T, E> {
		return false;
	}

	public isErr(): this is Err<T, E> {
		return true;
	}
}

/**
 * Construct a new Ok result value.
 */
export const ok = <T, E>(value: T): Ok<T, E> => new Ok(value);

/**
 * Construct a new Err result value.
 */
export const err = <T, E>(error: E): Err<T, E> => new Err(error);
