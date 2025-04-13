import { Link, useNavigate } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import type { ServerContext } from "~/core/server/context";
import { p } from "~/core/shared/path";

type BooksItemModel = {
	id: number;
	title: string;
	author: string;
	publishYear: number | null;
	categories: { id: number; name: string }[];
};

export async function bookListLoader(
	ctx: ServerContext,
): Promise<{ books: BooksItemModel[] }> {
	try {
		// Fetch all books
		const books = await getBooks(ctx);

		return { books };
	} catch (error) {
		ctx.logger.error("Failed to fetch books:", error);
		throw new Error("Failed to fetch books", { cause: error });
	}
}

async function getBooks(ctx: ServerContext): Promise<BooksItemModel[]> {
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

export function BookList({ books }: { books: BooksItemModel[] }) {
	const navigate = useNavigate();

	return (
		<div className="container mx-auto py-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Book List</h1>
				<Button asChild>
					<Link to={p("/books/new")}>Add</Link>
				</Button>
			</div>

			<Table>
				<TableCaption>All available books</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Title</TableHead>
						<TableHead>Author</TableHead>
						<TableHead>Publication Year</TableHead>
						<TableHead>Categories</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{books.length === 0 ? (
						<TableRow>
							<TableCell colSpan={5} className="text-center">
								No books found
							</TableCell>
						</TableRow>
					) : (
						books.map((book) => (
							<TableRow
								key={book.id}
								className="hover:bg-muted cursor-pointer"
								onClick={() => navigate(p(`/books/${book.id}`))}
							>
								<TableCell>{book.id}</TableCell>
								<TableCell className="font-medium">{book.title}</TableCell>
								<TableCell>{book.author}</TableCell>
								<TableCell>{book.publishYear}</TableCell>
								<TableCell>
									{book.categories.length === 0 ? (
										<span className="text-gray-500">Uncategorized</span>
									) : (
										<div className="flex flex-wrap gap-1">
											{book.categories.map((category) => (
												<Badge key={category.id} variant="outline">
													{category.name}
												</Badge>
											))}
										</div>
									)}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
