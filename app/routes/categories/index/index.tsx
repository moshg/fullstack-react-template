import { getAppContext } from "~/config/context";
import type { Route } from "./+types";
import { getCategories } from "./api/get-categories";
import { Categories } from "./components/categories";

export async function loader({ request }: Route.LoaderArgs) {
	try {
		const ctx = getAppContext(request);
		const categories = await getCategories(ctx);
		return { categories };
	} catch (error) {
		console.error("Failed to fetch categories:", error);
		return { categories: [] };
	}
}

export default function Component({ loaderData }: Route.ComponentProps) {
	return <Categories categories={loaderData.categories} />;
}
