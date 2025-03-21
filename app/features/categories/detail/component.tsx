import type { InferSelectModel } from "drizzle-orm";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { p } from "~/lib/path";
import type { categories } from "~/server/db/schema";

type Category = InferSelectModel<typeof categories>;

interface CategoryDetailProps {
	category: Category | null;
}

export function CategoryDetail({ category }: CategoryDetailProps) {
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
