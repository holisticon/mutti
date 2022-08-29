const prefix = "Invariant Failed";

/** Throws an error with an optional message if the provided condition is falsy. */
export function invariant<T>(
	condition: T,
	message?: string
): asserts condition {
	if (condition) return;

	// Code failed at an invariant (Jest will point at this line...)
	throw new Error(message ? `${prefix}: ${message}` : prefix);
}
