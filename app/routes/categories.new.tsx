import { newCategoryAction } from "~/features/categories/new/action";
import { NewCategory } from "~/features/categories/new/component";
import { serverContext } from "~/server/context";
import type { Route } from "./+types/categories.new";
export function meta() {
	return [
		{ title: "Add New Category" },
		{
			name: "description",
			content: "Create a new category for organizing books",
		},
	];
}

export async function action({ context, request }: Route.ActionArgs) {
	const ctx = context.get(serverContext);

	return newCategoryAction(ctx, request);
}

export default function Component() {
	return <NewCategory />;
}
