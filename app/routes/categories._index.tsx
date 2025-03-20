import { Categories } from "~/features/categories/index/component";
import { categoriesLoader } from "~/features/categories/index/loader";
import { serverContext } from "~/server/context";
import type { Route } from "./+types/categories._index";

export function meta() {
	return [
		{ title: "Category List" },
		{ name: "description", content: "Browse and manage book categories" },
	];
}

export async function loader({ context }: Route.LoaderArgs) {
	const ctx = context.get(serverContext);

	return categoriesLoader(ctx);
}

export default function Component({ loaderData }: Route.ComponentProps) {
	return <Categories categories={loaderData.categories} />;
}
