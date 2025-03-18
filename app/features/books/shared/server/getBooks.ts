import type { ServerContext } from "~/server/context";
import type { BookModel } from "../models/book-model";

export async function getBooks(ctx: ServerContext): Promise<BookModel[]> {
	// Fetch all books with their categories
	const booksWithCategories = await ctx.db.query.books.findMany({
		columns: {
			id: true,
			title: true,
			author: true,
			publishYear: true,
		},
		with: { bookCategories: { with: { category: true } } },
	});

	return booksWithCategories.map((book) => ({
		...book,
		categories: book.bookCategories.map((bc) => ({
			id: bc.category.id,
			name: bc.category.name,
		})),
	}));
}
