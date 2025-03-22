import { getServerContext } from "~/config/context";
import { Categories } from "~/features/categories/index/component";
import { categoriesLoader } from "~/features/categories/index/loader";
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
