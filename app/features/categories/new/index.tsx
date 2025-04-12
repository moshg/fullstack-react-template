import {
	type SubmissionResult,
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Link, redirect } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { RequiredBadge } from "~/components/ui/required-badge";
import { p } from "~/lib/path";
import type { ServerContext } from "~/server/context";
import { addCategory, categoryAddModelSchema } from "./server/add-category";

export async function newCategoryAction(ctx: ServerContext, request: Request) {
	try {
		const formData = await request.formData();
		const submission = parseWithZod(formData, {
			schema: categoryAddModelSchema,
		});

		// Return early if there are validation errors
		if (submission.status !== "success") {
			// If you want to return a strict response, wrap it with react-router's data and return 400
			// return data(submission.reply(), { status: 400 });
			return submission.reply();
		}

		// Create new category
		const result = await addCategory(ctx, submission.value);

		if (!result.ok) {
			return submission.reply({
				formErrors: [result.err.message],
			});
		}

		// Redirect to categories list page
		return redirect(p("/categories"));
	} catch (error) {
		ctx.logger.error("Failed to add category:", error);
		throw new Error("Failed to add category", { cause: error });
	}
}

export function NewCategory({
	lastResult,
}: { lastResult: SubmissionResult<string[]> | undefined }) {
	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: categoryAddModelSchema });
		},
		shouldRevalidate: "onBlur",
	});

	return (
		<div className="container mx-auto py-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Add New Category</h1>
				<Button asChild variant="outline">
					<Link to="/categories">Back to List</Link>
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Category Details</CardTitle>
				</CardHeader>
				<CardContent>
					<form method="post" className="space-y-4" {...getFormProps(form)}>
						{form.errors && (
							<div className="text-red-500 text-sm p-3 bg-red-50 rounded-md mb-4">
								{form.errors.map((error) => (
									<div key={error}>{error}</div>
								))}
							</div>
						)}
						<div>
							<label
								htmlFor={fields.name.id}
								className="block text-sm font-medium mb-1"
							>
								Name <RequiredBadge />
							</label>
							<input
								{...getInputProps(fields.name, { type: "text" })}
								className="w-full p-2 border rounded-md"
							/>
							{fields.name.errors && (
								<div className="text-red-500 text-sm mt-1">
									{fields.name.errors}
								</div>
							)}
						</div>

						<div>
							<label
								htmlFor={fields.description.id}
								className="block text-sm font-medium mb-1"
							>
								Description
							</label>
							<textarea
								{...getTextareaProps(fields.description)}
								className="w-full p-2 border rounded-md"
								rows={4}
							/>
							{fields.description.errors && (
								<div className="text-red-500 text-sm mt-1">
									{fields.description.errors}
								</div>
							)}
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
