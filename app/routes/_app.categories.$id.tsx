import { getServerContext } from "~/config/context";
import {
	CategoryDetail,
	categoryDetailLoader,
} from "~/features/categories/detail";
import type { Route } from "./+types/_app.categories.$id";

export function meta() {
	return [
		{ title: "Category Details" },
		{ name: "description", content: "View category details" },
	];
}

export async function loader({ request, params }: Route.LoaderArgs) {
	const ctx = getServerContext(request);
	return categoryDetailLoader(ctx, params.id);
}

export default function Component({ loaderData }: Route.ComponentProps) {
	return <CategoryDetail category={loaderData.category} />;
}
