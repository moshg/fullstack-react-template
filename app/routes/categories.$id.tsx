import { getServerContext } from "~/config/context";
import { CategoryDetail } from "~/features/categories/detail/component";
import { categoryLoader } from "~/features/categories/detail/loader";
import type { Route } from "./+types/categories.$id";

export function meta() {
	return [
		{ title: "Category Details" },
		{ name: "description", content: "View category details" },
	];
}

export async function loader({ request, params }: Route.LoaderArgs) {
	if (!params.id) {
		throw new Response("Category ID is required", { status: 400 });
	}

	const ctx = getServerContext(request);
	return categoryLoader(ctx, params.id);
}

export default function Component({ loaderData }: Route.ComponentProps) {
	const { category } = loaderData;
	return <CategoryDetail category={category} />;
}
