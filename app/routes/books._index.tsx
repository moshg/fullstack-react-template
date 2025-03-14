import { getAppContext } from "~/config/context";
import { getBooks } from "~/features/books/index/api/getBooks";
import Books from "~/features/books/index/components/books";
import type { Route } from "./+types/books._index";

export async function loader({ request }: Route.LoaderArgs) {
	const ctx = getAppContext(request);

	try {
		// Fetch all books
		const books = await getBooks(ctx);

		return { books };
	} catch (error) {
		ctx.logger.error("Failed to fetch books:", error);
		return { books: [] };
	}
}

export default function Component({ loaderData }: Route.ComponentProps) {
	const { books } = loaderData;

	return <Books books={books} />;
}
