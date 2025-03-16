import type { ServerContext } from "~/server/context";
import { getBooks } from "../shared/server/getBooks";

export async function booksLoader(ctx: ServerContext) {
	try {
		// Fetch all books
		const books = await getBooks(ctx);

		return { books };
	} catch (error) {
		ctx.logger.error("Failed to fetch books:", error);
		return { books: [] };
	}
}
