import { getServerContext } from "~/config/context";
import { BookList, bookListLoader } from "~/features/books/list";
import type { Route } from "./+types/_app.books._list";

export function meta() {
	return [
		{ title: "Book List" },
		{ name: "description", content: "Browse and manage your book collection" },
	];
}

export async function loader({ request }: Route.LoaderArgs) {
	const ctx = getServerContext(request);

	return bookListLoader(ctx);
}

export default function Component({ loaderData }: Route.ComponentProps) {
	const { books } = loaderData;

	return <BookList books={books} />;
}
