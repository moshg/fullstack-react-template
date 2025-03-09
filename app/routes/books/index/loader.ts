import { eq } from "drizzle-orm";
import { db } from "~/config/drizzle";
import { booksTable, categoriesTable } from "~/db/schema";

/**
 * Returns a list of all books with their categories
 */
export async function loader() {
	try {
		// Fetch books joined with their categories
		const books = await db
			.select({
				id: booksTable.id,
				title: booksTable.title,
				author: booksTable.author,
				publishYear: booksTable.publishYear,
				categoryId: booksTable.categoryId,
				categoryName: categoriesTable.name,
			})
			.from(booksTable)
			.leftJoin(categoriesTable, eq(booksTable.categoryId, categoriesTable.id));

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
