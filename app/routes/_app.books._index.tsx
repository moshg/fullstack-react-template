import { getServerContext } from "~/config/context";
import { Books } from "~/features/books/index/component";
import { booksLoader } from "~/features/books/index/loader";
import type { Route } from "./+types/_app.books._index";

export function meta() {
	return [
		{ title: "Book List" },
		{ name: "description", content: "Browse and manage your book collection" },
	];
}

export async function loader({ request }: Route.LoaderArgs) {
	const ctx = getServerContext(request);

	return booksLoader(ctx);
}

export default function Component({ loaderData }: Route.ComponentProps) {
	const { books } = loaderData;

	return <Books books={books} />;
}
