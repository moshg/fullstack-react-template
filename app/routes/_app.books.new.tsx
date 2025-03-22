import { useFetcher } from "react-router";
import { getServerContext } from "~/config/context";
import { newBookAction } from "~/features/books/new/action";
import { NewBook } from "~/features/books/new/component";
import { newBookLoader } from "~/features/books/new/loader";
import type { Route } from "./+types/_app.books.new";

export function meta() {
	return [
		{ title: "Add New Book" },
		{ name: "description", content: "Add a new book to your collection" },
	];
}

export async function loader({ request }: Route.LoaderArgs) {
	const ctx = getServerContext(request);

	return newBookLoader(ctx);
}

export async function action({ request }: Route.ActionArgs) {
	const ctx = getServerContext(request);

	return newBookAction(ctx, request);
}

export default function Component({ loaderData }: Route.ComponentProps) {
	const categoriesFetcher = useFetcher<typeof loader>();
	return (
		<NewBook
			categories={loaderData.categories}
			categoriesFetcher={categoriesFetcher}
		/>
	);
}
