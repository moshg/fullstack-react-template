import type { Route } from "./+types";
import { getCategories } from "./api/get-categories";
import { Categories } from "./components/categories";

export async function loader() {
	try {
		const categories = await getCategories();
		return { categories };
	} catch (error) {
		console.error("Failed to fetch categories:", error);
		return { categories: [] };
	}
}

export default function Component({ loaderData }: Route.ComponentProps) {
	return <Categories categories={loaderData.categories} />;
}
