import { parseWithZod } from "@conform-to/zod";
import { redirect } from "react-router";
import type { ServerContext } from "~/server/context";
import { createBook } from "../shared/server/create-book";
import { bookCreateRequestSchema } from "./models/book-create-request";

export async function newBookAction(ctx: ServerContext, request: Request) {
	try {
		const formData = await request.formData();
		const submission = parseWithZod(formData, {
			schema: bookCreateRequestSchema,
		});

		// Return early if there are validation errors
		if (submission.status !== "success") {
			return submission.reply();
		}

		// Insert the new book
		await createBook(ctx, submission.value);

		// Redirect to the books list page
		return redirect("/books");
	} catch (error) {
		ctx.logger.error("Failed to create book:", error);
		return {
			errors: { form: "Failed to create book. Please try again." },
		};
	}
}
