import type { ServerContext } from "~/server/context";
import { books, booksToCategories } from "~/server/db/schema";
import type { BookCreateModel } from "../models/book-create-model";

export async function createBook(
	ctx: ServerContext,
	book: BookCreateModel,
): Promise<{ id: number }> {
	return await ctx.db.transaction(async (tx) => {
		// Insert the new book
		const [newBook] = await tx
			.insert(books)
			.values({
				title: book.title,
				author: book.author,
				publishYear: book.publishYear,
			})
			.returning({ id: books.id });

		// Insert book-category relationships
		if (book.categoryIds.length > 0) {
			const bookCategoryValues = book.categoryIds.map((categoryId) => ({
				bookId: newBook.id,
				categoryId: categoryId,
			}));

			await tx.insert(booksToCategories).values(bookCategoryValues);
		}

		return newBook;
	});
}
