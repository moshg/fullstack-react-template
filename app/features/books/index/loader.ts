import type { ServerContext } from "~/server/context";
import type { BookModel } from "./models/book-model";

export async function booksLoader(
	ctx: ServerContext,
): Promise<{ books: BookModel[] }> {
	try {
		// Fetch all books
		const books = await getBooks(ctx);

		return { books };
	} catch (error) {
		ctx.logger.error("Failed to fetch books:", error);
		throw new Error("Failed to fetch books", { cause: error });
	}
}

export async function getBooks(ctx: ServerContext): Promise<BookModel[]> {
	// Fetch all books with their categories
	const booksWithCategories = await ctx.db.query.books.findMany({
		columns: {
			id: true,
			title: true,
			author: true,
			publishYear: true,
		},
		with: {
			bookCategories: {
				with: {
					category: {
						columns: {
							id: true,
							name: true,
						},
					},
				},
			},
		},
	});

	return booksWithCategories.map((bookWithCategories) => {
		const { bookCategories, ...book } = bookWithCategories;
		return {
			...book,
			categories: bookCategories.map((bc) => ({
				id: bc.category.id,
				name: bc.category.name,
			})),
		};
	});
}
