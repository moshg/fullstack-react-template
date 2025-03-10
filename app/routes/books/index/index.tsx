import { getAppContext } from "~/config/context";
import type { Route } from "./+types";
import { getBooks } from "./api/getBooks";
import Books from "./components/books";

export async function loader({ request }: Route.LoaderArgs) {
	try {
		const ctx = getAppContext(request);

		// Fetch all books
		const books = await getBooks(ctx);

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
