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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RequiredBadge } from "~/components/ui/required-badge";
import { Textarea } from "~/components/ui/textarea";
import type { ServerContext } from "~/core/server/context";
import { p } from "~/core/shared/path";
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
							<Label htmlFor={fields.name.id} className="mb-1.5">
								Name <RequiredBadge />
							</Label>
							<Input {...getInputProps(fields.name, { type: "text" })} />
							{fields.name.errors && (
								<div className="text-red-500 text-sm mt-1">
									{fields.name.errors}
								</div>
							)}
						</div>

						<div>
							<Label htmlFor={fields.description.id} className="mb-1.5">
								Description
							</Label>
							<Textarea {...getTextareaProps(fields.description)} rows={4} />
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
