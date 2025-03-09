import type { Route } from "./+types";
import { getBooks } from "./api/getBooks";
import Books from "./components/books";

export async function loader() {
	try {
		// Fetch all books
		const books = await getBooks();

		return { books };
	} catch (error) {
		console.error("Failed to fetch books:", error);
		return { books: [] };
	}
}

export default function Component({ loaderData }: Route.ComponentProps) {
	const { books } = loaderData;

	return <Books books={books} />;
}
