import { Link, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { p } from "~/lib/path";
import type { ServerContext } from "~/server/context";

type CategoriesItemModel = {
	id: number;
	name: string;
	description: string | null;
};

export async function categoriesLoader(ctx: ServerContext): Promise<{
	categories: CategoriesItemModel[];
}> {
	try {
		const categories = await getCategories(ctx);
		return { categories };
	} catch (error) {
		ctx.logger.error("Failed to fetch categories:", error);
		throw new Error("Failed to fetch categories", { cause: error });
	}
}

/**
 * Returns a list of all categories
 */
async function getCategories(
	ctx: ServerContext,
): Promise<CategoriesItemModel[]> {
	// Fetch all categories
	return await ctx.db.query.categories.findMany({
		// Explicitly specify columns to avoid unintentionally fetching additional columns when the DB schema changes
		columns: {
			id: true,
			name: true,
			description: true,
		},
	});
}

export function Categories({
	categories,
}: {
	categories: CategoriesItemModel[];
}) {
	const navigate = useNavigate();

	return (
		<div className="container mx-auto py-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Category List</h1>
				<Button asChild>
					<Link to={p("/categories/new")}>Add</Link>
				</Button>
			</div>

			<Table>
				<TableCaption>All available categories</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Description</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{categories.length === 0 ? (
						<TableRow>
							<TableCell colSpan={3} className="text-center">
								No categories found
							</TableCell>
						</TableRow>
					) : (
						categories.map((category) => (
							<TableRow
								key={category.id}
								className="hover:bg-muted cursor-pointer"
								onClick={() => navigate(p(`/categories/${category.id}`))}
							>
								<TableCell>{category.id}</TableCell>
								<TableCell className="font-medium">{category.name}</TableCell>
								<TableCell>
									{category.description || "No description"}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
