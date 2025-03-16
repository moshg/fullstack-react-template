import { getServerContext } from "~/config/context";
import Books from "~/features/books/index/components/books";
import { getBooks } from "~/features/books/shared/server/getBooks";
import type { Route } from "./+types/books._index";

export function meta() {
	return [
		{ title: "Book List" },
		{ name: "description", content: "Browse and manage your book collection" },
	];
}

export async function loader({ request }: Route.LoaderArgs) {
	const ctx = getServerContext(request);

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
