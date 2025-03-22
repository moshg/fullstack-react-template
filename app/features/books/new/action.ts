import { parseWithZod } from "@conform-to/zod";
import { redirect } from "react-router";
import type { ServerContext } from "~/server/context";
import { addBook } from "../shared/server/add-book";
import { bookAddRequestSchema } from "./models/book-add-request";

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
