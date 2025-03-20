import { Books } from "~/features/books/index/component";
import { booksLoader } from "~/features/books/index/loader";
import { serverContext } from "~/server/context";
import type { Route } from "./+types/books._index";

export function meta() {
	return [
		{ title: "Book List" },
		{ name: "description", content: "Browse and manage your book collection" },
	];
}

export async function loader({ context }: Route.LoaderArgs) {
	const ctx = context.get(serverContext);

	return booksLoader(ctx);
}

export default function Component({ loaderData }: Route.ComponentProps) {
	const { books } = loaderData;

	return <Books books={books} />;
}
