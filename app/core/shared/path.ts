export type Path =
	| "/"
	| "/books"
	| "/books/new"
	| `/books/${string}`
	| "/categories"
	| "/categories/new"
	| `/categories/${string}`
	| "/signin"
	| "/signup"
	| "/verify-otp";

/**
 * Type-safe path helper function.
 *
 * This function ensures type safety for route paths in the application.
 *
 * @param path - The route path to be validated
 * @returns The validated path with type safety
 *
 * @example
 * ```ts
 * // Valid usage
 * p("/books")     // OK
 * p("/books/new") // OK
 *
 * // Invalid usage (TypeScript error)
 * p("/invalid")   // Error: Argument of type '"/invalid"' is not assignable to parameter of type 'Path'
 * ```
 */
export function p<T extends Path>(path: T): T {
	return path;
}
