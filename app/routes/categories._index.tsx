import { getAppContext } from "~/config/context";
import { getCategories } from "~/features/categories/index/api/get-categories";
import { Categories } from "~/features/categories/index/components/categories";
import type { Route } from "./+types/categories._index";

export function meta() {
	return [
		{ title: "Category List" },
		{ name: "description", content: "Browse and manage book categories" },
	];
}

export async function loader({ request }: Route.LoaderArgs) {
	const ctx = getAppContext(request);

	try {
		const categories = await getCategories(ctx);
		return { categories };
	} catch (error) {
		ctx.logger.error("Failed to fetch categories:", error);
		return { categories: [] };
	}
}

export default function Component({ loaderData }: Route.ComponentProps) {
	return <Categories categories={loaderData.categories} />;
}
