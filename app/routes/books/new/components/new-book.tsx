import { RefreshCw } from "lucide-react";
import { type FetcherWithComponents, Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import type { CategoryModel } from "~/routes/categories/index/types/category-model";

export default function NewBook({
	categories,
	categoriesFetcher,
}: {
	categories: CategoryModel[];
	categoriesFetcher: FetcherWithComponents<{
		categories: CategoryModel[];
	}>;
}) {
	// Function to refresh the categories list
	const refreshCategories = () => {
		categoriesFetcher.load("/books/new");
	};

	// Use updated categories if available
	const displayCategories = categoriesFetcher.data?.categories || categories;

	return (
		<div className="container mx-auto py-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Add New Book</h1>
				<Link to="/books">
					<Button variant="outline">Back to List</Button>
				</Link>
			</div>

			<div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm">
				<form method="post" className="space-y-4">
					<div>
						<label htmlFor="title" className="block text-sm font-medium mb-1">
							Title
						</label>
						<input
							type="text"
							id="title"
							name="title"
							className="w-full p-2 border rounded-md"
							required
						/>
					</div>

					<div>
						<label htmlFor="author" className="block text-sm font-medium mb-1">
							Author
						</label>
						<input
							type="text"
							id="author"
							name="author"
							className="w-full p-2 border rounded-md"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="publishYear"
							className="block text-sm font-medium mb-1"
						>
							Publication Year
						</label>
						<input
							type="number"
							id="publishYear"
							name="publishYear"
							className="w-full p-2 border rounded-md"
							min="1000"
							max={new Date().getFullYear()}
						/>
					</div>

					<div>
						<div className="flex justify-between items-center mb-2">
							{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
							<label className="block text-sm font-medium">Categories</label>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={refreshCategories}
								disabled={categoriesFetcher.state === "loading"}
								title="Refresh Categories"
								className="h-8 w-8"
							>
								<RefreshCw
									className={`h-4 w-4 ${categoriesFetcher.state === "loading" ? "animate-spin" : ""}`}
								/>
							</Button>
						</div>
						<div className="space-y-2">
							{displayCategories.map((category) => (
								<div key={category.id} className="flex items-center space-x-2">
									<Checkbox
										id={`category-${category.id}`}
										name="categoryIds"
										value={category.id.toString()}
									/>
									<Label htmlFor={`category-${category.id}`}>
										{category.name}
									</Label>
								</div>
							))}
							{displayCategories.length === 0 && (
								<p className="text-sm text-gray-500">No categories available</p>
							)}
						</div>
					</div>

					<div className="flex justify-end pt-4">
						<Button type="submit">Save Book</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
