import { getServerContext } from "~/config/context";
import { CategoryList, categoryListLoader } from "~/features/categories/list";
import type { Route } from "./+types/_app.categories._list";

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
