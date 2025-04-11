import { getServerContext } from "~/config/context";
import { CategoryList, categoryListLoader } from "~/features/categories/index";
import type { Route } from "./+types/_app.categories._index";

export function meta() {
	return [
		{ title: "Category List" },
		{ name: "description", content: "Browse and manage book categories" },
	];
}

export async function loader({ request }: Route.LoaderArgs) {
	const ctx = getServerContext(request);

	return categoryListLoader(ctx);
}

export default function Component({ loaderData }: Route.ComponentProps) {
	return <CategoryList categories={loaderData.categories} />;
}
