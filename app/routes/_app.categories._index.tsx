import { getServerContext } from "~/config/context";
import { Categories, categoriesLoader } from "~/features/categories/index";
import type { Route } from "./+types/_app.categories._index";

export function meta() {
	return [
		{ title: "Category List" },
		{ name: "description", content: "Browse and manage book categories" },
	];
}

export async function loader({ request }: Route.LoaderArgs) {
	const ctx = getServerContext(request);

	return categoriesLoader(ctx);
}

export default function Component({ loaderData }: Route.ComponentProps) {
	return <Categories categories={loaderData.categories} />;
}
