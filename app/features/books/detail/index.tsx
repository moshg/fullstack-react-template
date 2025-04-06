import { eq } from "drizzle-orm";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { p } from "~/lib/path";
import type { ServerContext } from "~/server/context";
import { books } from "~/server/db/schema";

export type BookDetailModel = {
	id: number;
	title: string;
	author: string;
	publishYear: number | null;
	categories: { id: number; name: string }[];
};

export async function bookLoader(
	ctx: ServerContext,
	id: string,
): Promise<{ book: BookDetailModel | null }> {
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
): Promise<BookDetailModel | null> {
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

export function BookDetail({ book }: { book: BookDetailModel | null }) {
	return (
		<div className="container mx-auto py-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Book Details</h1>
				<Button asChild variant="outline">
					<Link to={p("/books")}>Back to List</Link>
				</Button>
			</div>

			{book ? (
				<Card>
					<CardHeader>
						<CardTitle>{book.title}</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<h3 className="font-semibold mb-1">Author</h3>
							<p className="text-muted-foreground">{book.author}</p>
						</div>
						<div>
							<h3 className="font-semibold mb-1">Publication Year</h3>
							<p className="text-muted-foreground">{book.publishYear}</p>
						</div>

						<div>
							<h3 className="font-semibold mb-2">Categories</h3>
							<div className="flex gap-2 flex-wrap">
								{book.categories.length > 0 ? (
									book.categories.map((category) => (
										<Badge key={category.id} variant="secondary">
											{category.name}
										</Badge>
									))
								) : (
									<p className="text-muted-foreground">
										No categories assigned
									</p>
								)}
							</div>
						</div>
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardContent>
						<p className="text-muted-foreground text-center py-8">
							Book not found.
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
