import { z } from "zod";
import type { ServerContext } from "~/core/server/context";
import { books, booksToCategories } from "~/core/server/db/schema";

export const bookCreateModelSchema = z
	.object({
		title: z.string().min(1, "Title is required"),
		author: z.string().min(1, "Author is required"),
		publishYear: z
			.number()
			.int()
			.min(1000, "Year must be at least 1000")
			.max(new Date().getFullYear(), "Year cannot be in the future")
			.optional(),
		categoryIds: z.array(z.number().int()),
	})
	.brand<"BookCreateModel">();

export type BookAddModel = z.infer<typeof bookCreateModelSchema>;

export async function addBook(
	ctx: ServerContext,
	book: BookAddModel,
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
