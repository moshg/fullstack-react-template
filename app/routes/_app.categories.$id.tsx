import { getServerContext } from "~/config/context";
import {
	CategoryDetails,
	categoryDetailsLoader,
} from "~/features/categories/details";
import type { Route } from "./+types/_app.categories.$id";

export function meta() {
	return [
		{ title: "Category Details" },
		{ name: "description", content: "View category details" },
	];
}

export async function loader({ request, params }: Route.LoaderArgs) {
	const ctx = getServerContext(request);
	return categoryDetailsLoader(ctx, params.id);
}

export default function Component({ loaderData }: Route.ComponentProps) {
	return <CategoryDetails category={loaderData.category} />;
}
