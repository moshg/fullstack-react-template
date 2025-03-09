import { Link, redirect, useLoaderData } from "react-router";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { db } from "~/config/drizzle";
import { bookCategoriesTable, booksTable, categoriesTable } from "~/db/schema";

export async function loader() {
	try {
		const categories = await db.select().from(categoriesTable);
		return { categories };
	} catch (error) {
		console.error("Failed to fetch categories:", error);
		return { categories: [] };
	}
}

export async function action({ request }: { request: Request }) {
	try {
		const formData = await request.formData();
		const title = formData.get("title") as string;
		const author = formData.get("author") as string;
		const publishYearStr = formData.get("publishYear") as string;

		// Get all selected category IDs
		const categoryIds = formData.getAll("categoryIds") as string[];

		// Validate required fields
		const errors: Record<string, string> = {};
		if (!title) errors.title = "Title is required";
		if (!author) errors.author = "Author is required";

		// If there are validation errors, return them
		if (Object.keys(errors).length > 0) {
			return {
				errors,
				values: {
					title,
					author,
					publishYear: publishYearStr,
					categoryIds,
				},
			};
		}

		// Convert publishYear to number if provided
		const publishYear = publishYearStr
			? Number.parseInt(publishYearStr, 10)
			: undefined;

		// Insert the new book
		const [newBook] = await db
			.insert(booksTable)
			.values({
				title,
				author,
				publishYear: Number.isNaN(publishYear as number)
					? undefined
					: publishYear,
			})
			.returning({ id: booksTable.id });

		// Insert book-category relationships
		if (categoryIds.length > 0) {
			const bookCategoryValues = categoryIds.map((categoryId) => ({
				bookId: newBook.id,
				categoryId: Number.parseInt(categoryId, 10),
			}));

			await db.insert(bookCategoriesTable).values(bookCategoryValues);
		}

		// Redirect to the books list page
		return redirect("/books");
	} catch (error) {
		console.error("Failed to create book:", error);
		return {
			errors: { form: "Failed to create book. Please try again." },
			values: request.formData,
		};
	}
}

export default function NewBook() {
	const { categories } = useLoaderData<typeof loader>();

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
						{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
						<label className="block text-sm font-medium mb-2">Categories</label>
						<div className="space-y-2">
							{categories.map((category) => (
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
