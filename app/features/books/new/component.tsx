import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { RefreshCw } from "lucide-react";
import { type FetcherWithComponents, Link, useActionData } from "react-router";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { RequiredBadge } from "~/components/ui/required-badge";
import type { CategoryModel } from "~/features/categories/index/models/category-model";
import { bookCreateRequestSchema } from "./models/book-create-request";

export function NewBook({
	categories,
	categoriesFetcher,
}: {
	categories: CategoryModel[];
	categoriesFetcher: FetcherWithComponents<{
		categories: CategoryModel[];
	}>;
}) {
	const lastResult = useActionData();
	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: bookCreateRequestSchema });
		},
		shouldRevalidate: "onBlur",
	});

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
				<Button asChild>
					<Link to="/books">Back to List</Link>
				</Button>
			</div>

			<div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm">
				<form method="post" className="space-y-4" {...getFormProps(form)}>
					{form.errors && (
						<div className="text-red-500 text-sm">{form.errors}</div>
					)}

					<div>
						<label
							htmlFor={fields.title.id}
							className="block text-sm font-medium mb-1"
						>
							Title <RequiredBadge />
						</label>
						<input
							{...getInputProps(fields.title, { type: "text" })}
							className="w-full p-2 border rounded-md"
						/>
						{fields.title.errors && (
							<div className="text-red-500 text-sm mt-1">
								{fields.title.errors}
							</div>
						)}
					</div>

					<div>
						<label
							htmlFor={fields.author.id}
							className="block text-sm font-medium mb-1"
						>
							Author <RequiredBadge />
						</label>
						<input
							{...getInputProps(fields.author, { type: "text" })}
							className="w-full p-2 border rounded-md"
						/>
						{fields.author.errors && (
							<div className="text-red-500 text-sm mt-1">
								{fields.author.errors}
							</div>
						)}
					</div>

					<div>
						<label
							htmlFor={fields.publishYear.id}
							className="block text-sm font-medium mb-1"
						>
							Publication Year
						</label>
						<input
							{...getInputProps(fields.publishYear, { type: "number" })}
							className="w-full p-2 border rounded-md"
							min="1000"
							max={new Date().getFullYear()}
						/>
						{fields.publishYear.errors && (
							<div className="text-red-500 text-sm mt-1">
								{fields.publishYear.errors}
							</div>
						)}
					</div>

					<div>
						<div className="flex justify-between items-center mb-2">
							<span className="block text-sm font-medium">Categories</span>
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
							{fields.categoryIds?.errors && (
								<div className="text-red-500 text-sm mt-1">
									{fields.categoryIds.errors}
								</div>
							)}
						</div>
					</div>

					<div className="flex justify-end pt-4">
						<Button type="submit">Add</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
