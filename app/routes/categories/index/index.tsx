import { Link, useLoaderData } from "react-router";
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
import type { loader } from "./loader";

export { loader } from "./loader";

export default function Categories() {
	const { categories } = useLoaderData<typeof loader>();

	return (
		<div className="container mx-auto py-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Category List</h1>
				<Link to="/categories/new">
					<Button>Add Category</Button>
				</Link>
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
							<TableRow key={category.id}>
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
