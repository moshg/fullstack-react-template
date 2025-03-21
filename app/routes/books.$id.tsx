import { getServerContext } from "~/config/context";
import { BookDetail } from "~/features/books/detail/component";
import { bookLoader } from "~/features/books/detail/loader";
import type { Route } from "./+types/books.$id";

export function meta() {
	return [
		{ title: "Book Details" },
		{ name: "description", content: "View book details" },
	];
}

export async function loader({ request, params }: Route.LoaderArgs) {
	const ctx = getServerContext(request);
	return bookLoader(ctx, params.id);
}

export default function Component({ loaderData }: Route.ComponentProps) {
	const { book } = loaderData;
	return <BookDetail book={book} />;
}
