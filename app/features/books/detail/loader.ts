import { eq } from "drizzle-orm";
import type { ServerContext } from "~/server/context";
import { books } from "~/server/db/schema";
import type { BookModel } from "../index/models/book-model";

export async function bookLoader(
	ctx: ServerContext,
	id: string,
): Promise<{ book: BookModel | null }> {
	const bookId = Number.parseInt(id, 10);
	if (Number.isNaN(bookId)) {
		return { book: null };
	}

	try {
		const book = await getBook(ctx, bookId);
		return { book };
	} catch (error) {
		ctx.logger.error("Failed to fetch book:", error);
		throw new Error("Failed to fetch book", { cause: error });
	}
}

export async function getBook(
	ctx: ServerContext,
	bookId: number,
): Promise<BookModel | null> {
	const { db } = ctx;

	const bookWithCategories = await db.query.books.findFirst({
		where: eq(books.id, bookId),
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

	if (!bookWithCategories) {
		return null;
	}

	const { bookCategories, ...book } = bookWithCategories;
	return {
		...book,
		categories: bookCategories.map(
			(bc: { category: { id: number; name: string } }) => ({
				id: bc.category.id,
				name: bc.category.name,
			}),
		),
	};
}
