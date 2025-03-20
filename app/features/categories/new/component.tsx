import {
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Link, useActionData } from "react-router";
import { Button } from "~/components/ui/button";
import { RequiredBadge } from "~/components/ui/required-badge";
import { categoryCreateModelSchema } from "../shared/models/category-create-model";

export function NewCategory() {
	const lastResult = useActionData();
	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: categoryCreateModelSchema });
		},
		shouldRevalidate: "onBlur",
	});

	return (
		<div className="container mx-auto py-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Add New Category</h1>
				<Button asChild>
					<Link to="/categories">Back to List</Link>
				</Button>
			</div>

			<div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm">
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
			</div>
		</div>
	);
}
