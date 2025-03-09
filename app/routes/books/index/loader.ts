import { db } from "~/config/drizzle";
import { booksTable } from "~/db/schema";

/**
 * Returns a list of all books
 */
export async function loader() {
	try {
		const books = await db.select().from(booksTable);
		return { books };
	} catch (error) {
		console.error("Failed to fetch books:", error);
		return new Response(JSON.stringify({ error: "Failed to fetch books" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
}
