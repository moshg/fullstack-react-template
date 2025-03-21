/**
 * Generates a random 5-character alphanumeric ID.
 */
export function generateId() {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	for (let i = 0; i < 5; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}
