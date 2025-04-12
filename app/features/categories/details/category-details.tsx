import { eq } from "drizzle-orm";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { ServerContext } from "~/core/server/context";
import { categories } from "~/core/server/db/schema";
import { p } from "~/core/shared/path";

type CategoryDetailModel = {
	id: number;
	name: string;
	description: string | null;
};

export async function categoryDetailsLoader(ctx: ServerContext, id: string) {
	const categoryId = Number.parseInt(id, 10);

	if (Number.isNaN(categoryId)) {
		return { category: null };
	}

	const category = await getCategoryDetails(ctx, categoryId);
	return { category };
}

async function getCategoryDetails(
	ctx: ServerContext,
	id: number,
): Promise<CategoryDetailModel | null> {
	const category = await ctx.db.query.categories.findFirst({
		where: eq(categories.id, id),
		columns: {
			id: true,
			name: true,
			description: true,
		},
	});
	return category ?? null;
}

export function CategoryDetails({
	category,
}: { category: CategoryDetailModel | null }) {
	return (
		<div className="container mx-auto py-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Category Details</h1>
				<Button asChild variant="outline">
					<Link to={p("/categories")}>Back to List</Link>
				</Button>
			</div>

			{category ? (
				<Card>
					<CardHeader>
						<CardTitle>{category.name}</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground">
							{category.description || "No description provided."}
						</p>
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardContent>
						<p className="text-muted-foreground text-center py-8">
							Category not found.
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
