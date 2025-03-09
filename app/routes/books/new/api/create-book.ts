import { db } from "~/config/drizzle";
import { bookCategoriesTable, booksTable } from "~/db/schema";
import type { BookCreateModel } from "../types/book-create-model";

export async function createBook(
	book: BookCreateModel,
): Promise<{ id: number }> {
	return await db.transaction(async (tx) => {
		// Insert the new book
		const [newBook] = await tx
			.insert(booksTable)
			.values({
				title: book.title,
				author: book.author,
				publishYear: book.publishYear,
			})
			.returning({ id: booksTable.id });

		// Insert book-category relationships
		if (book.categoryIds.length > 0) {
			const bookCategoryValues = book.categoryIds.map((categoryId) => ({
				bookId: newBook.id,
				categoryId: categoryId,
			}));

			await tx.insert(bookCategoriesTable).values(bookCategoryValues);
		}

		return newBook;
	});
}
