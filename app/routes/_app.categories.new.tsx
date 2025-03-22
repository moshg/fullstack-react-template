import { getServerContext } from "~/config/context";
import { newCategoryAction } from "~/features/categories/new/action";
import { NewCategory } from "~/features/categories/new/component";
import type { Route } from "./+types/_app.categories.new";

export function meta() {
	return [
		{ title: "Add New Category" },
		{
			name: "description",
			content: "Create a new category for organizing books",
		},
	];
}

export async function action({ request }: Route.ActionArgs) {
	const ctx = getServerContext(request);

	return newCategoryAction(ctx, request);
}

export default function Component() {
	return <NewCategory />;
}
