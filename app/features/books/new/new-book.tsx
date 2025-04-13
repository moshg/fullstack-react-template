import {
	type SubmissionResult,
	getFormProps,
	getInputProps,
	useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { RefreshCw } from "lucide-react";
import { type FetcherWithComponents, Link, redirect } from "react-router";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RequiredBadge } from "~/components/ui/required-badge";
import type { ServerContext } from "~/core/server/context";
import { addBook, bookCreateModelSchema } from "./server/add-book";

type CategoryModel = {
	id: number;
	name: string;
};

export async function newBookLoader(ctx: ServerContext) {
	try {
		const categories = await getCategories(ctx);
		return { categories };
	} catch (error) {
		ctx.logger.error("Failed to fetch categories:", error);
		throw new Error("Failed to fetch categories", { cause: error });
	}
}

function getCategories(ctx: ServerContext) {
	return ctx.db.query.categories.findMany({
		columns: {
			id: true,
			name: true,
		},
	});
}

export const bookAddRequestSchema = z
	.object({
		title: z.string(),
		author: z.string(),
		publishYear: z
			.string()
			.optional()
			.transform((val) => (val ? Number(val) : undefined)),
		categoryIds: z
			.array(z.string())
			.transform((val) => val.map((id) => Number(id))),
	})
	.pipe(bookCreateModelSchema);

export type BookCreateRequest = z.infer<typeof bookAddRequestSchema>;

export async function newBookAction(ctx: ServerContext, request: Request) {
	try {
		const formData = await request.formData();
		const submission = parseWithZod(formData, {
			schema: bookAddRequestSchema,
		});

		// Return early if there are validation errors
		if (submission.status !== "success") {
			return submission.reply();
		}

		// Insert the new book
		await addBook(ctx, submission.value);

		// Redirect to the books list page
		return redirect("/books");
	} catch (error) {
		ctx.logger.error("Failed to add book:", error);
		throw new Error("Failed to add book", { cause: error });
	}
}

export function NewBook({
	categories,
	categoriesFetcher,
	lastResult,
}: {
	categories: CategoryModel[];
	categoriesFetcher: FetcherWithComponents<{
		categories: CategoryModel[];
	}>;
	lastResult: SubmissionResult<string[]> | undefined;
}) {
	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: bookAddRequestSchema });
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
				<Button asChild variant="outline">
					<Link to="/books">Back to List</Link>
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Book Details</CardTitle>
				</CardHeader>
				<CardContent>
					<form method="post" className="space-y-4" {...getFormProps(form)}>
						{form.errors && (
							<div className="text-red-500 text-sm">{form.errors}</div>
						)}

						<div>
							<Label htmlFor={fields.title.id} className="mb-1.5">
								Title <RequiredBadge />
							</Label>
							<Input {...getInputProps(fields.title, { type: "text" })} />
							{fields.title.errors && (
								<div className="text-red-500 text-sm mt-1">
									{fields.title.errors}
								</div>
							)}
						</div>

						<div>
							<Label htmlFor={fields.author.id} className="mb-1.5">
								Author <RequiredBadge />
							</Label>
							<Input {...getInputProps(fields.author, { type: "text" })} />
							{fields.author.errors && (
								<div className="text-red-500 text-sm mt-1">
									{fields.author.errors}
								</div>
							)}
						</div>

						<div>
							<Label htmlFor={fields.publishYear.id} className="mb-1.5">
								Publication Year
							</Label>
							<Input
								{...getInputProps(fields.publishYear, { type: "number" })}
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
									<div
										key={category.id}
										className="flex items-center space-x-2"
									>
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
									<p className="text-sm text-gray-500">
										No categories available
									</p>
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
				</CardContent>
			</Card>
		</div>
	);
}
