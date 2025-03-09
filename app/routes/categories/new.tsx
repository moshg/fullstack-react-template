import { Link, redirect } from "react-router";
import { Button } from "~/components/ui/button";
import { db } from "~/config/drizzle";
import { categoriesTable } from "~/db/schema";

export async function action({ request }: { request: Request }) {
	try {
		const formData = await request.formData();
		const name = formData.get("name") as string;
		const description = formData.get("description") as string;

		// Validate required fields
		const errors: Record<string, string> = {};
		if (!name) errors.name = "Name is required";

		// If there are validation errors, return them
		if (Object.keys(errors).length > 0) {
			return {
				errors,
				values: {
					name,
					description,
				},
			};
		}

		// Insert the new category
		await db.insert(categoriesTable).values({
			name,
			description: description || undefined,
		});

		// Redirect to the categories list page
		return redirect("/categories");
	} catch (error) {
		console.error("Failed to create category:", error);
		return {
			errors: { form: "Failed to create category. Please try again." },
			values: request.formData,
		};
	}
}

export default function NewCategory() {
	return (
		<div className="container mx-auto py-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Add New Category</h1>
				<Link to="/categories">
					<Button variant="outline">Back to List</Button>
				</Link>
			</div>

			<div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm">
				<form method="post" className="space-y-4">
					<div>
						<label htmlFor="name" className="block text-sm font-medium mb-1">
							Name
						</label>
						<input
							type="text"
							id="name"
							name="name"
							className="w-full p-2 border rounded-md"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="description"
							className="block text-sm font-medium mb-1"
						>
							Description
						</label>
						<textarea
							id="description"
							name="description"
							className="w-full p-2 border rounded-md"
							rows={4}
						/>
					</div>

					<div className="flex justify-end pt-4">
						<Button type="submit">Save Category</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
