import { eq } from "drizzle-orm";
import { db } from "~/config/drizzle";
import { bookCategoriesTable, booksTable, categoriesTable } from "~/db/schema";

/**
 * Returns a list of all books with their categories
 */
export async function loader() {
	try {
		// Fetch all books
		const books = await db
			.select({
				id: booksTable.id,
				title: booksTable.title,
				author: booksTable.author,
				publishYear: booksTable.publishYear,
			})
			.from(booksTable);

		// For each book, fetch its categories
		const booksWithCategories = await Promise.all(
			books.map(async (book) => {
				const categories = await db
					.select({
						id: categoriesTable.id,
						name: categoriesTable.name,
					})
					.from(bookCategoriesTable)
					.innerJoin(
						categoriesTable,
						eq(bookCategoriesTable.categoryId, categoriesTable.id),
					)
					.where(eq(bookCategoriesTable.bookId, book.id));

				return {
					...book,
					categories,
				};
			}),
		);

		return { books: booksWithCategories };
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
