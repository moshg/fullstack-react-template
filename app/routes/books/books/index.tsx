import { useLoaderData } from "react-router";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import type { loader } from "./loader";

export { action } from "./action";
export { loader } from "./loader";

export default function Books() {
	const { books } = useLoaderData<typeof loader>();

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-2xl font-bold mb-6">Book List</h1>

			<Table>
				<TableCaption>All available books</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Title</TableHead>
						<TableHead>Author</TableHead>
						<TableHead>Publication Year</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{books.length === 0 ? (
						<TableRow>
							<TableCell colSpan={4} className="text-center">
								No books found
							</TableCell>
						</TableRow>
					) : (
						books.map((book) => (
							<TableRow key={book.id}>
								<TableCell>{book.id}</TableCell>
								<TableCell className="font-medium">{book.title}</TableCell>
								<TableCell>{book.author}</TableCell>
								<TableCell>{book.publishYear || "Unknown"}</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
