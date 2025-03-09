import { z } from "zod";
import { db } from "~/config/drizzle";
import { booksTable } from "~/db/schema";

/**
 * Creates a new book
 */
export async function action({ request }: { request: Request }) {
	try {
		if (request.method !== "POST") {
			return new Response(JSON.stringify({ error: "Method not allowed" }), {
				status: 405,
				headers: {
					"Content-Type": "application/json",
					Allow: "POST",
				},
			});
		}

		const bookSchema = z.object({
			title: z.string().min(1, "Title is required"),
			author: z.string().min(1, "Author is required"),
			publishYear: z.number().optional(),
		});

		const data = await request.json();
		const result = bookSchema.safeParse(data);

		if (!result.success) {
			return new Response(
				JSON.stringify({
					error: "Validation failed",
					details: result.error.format(),
				}),
				{
					status: 400,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		}

		const newBook = await db.insert(booksTable).values(result.data).returning();

		return new Response(JSON.stringify({ book: newBook[0] }), {
			status: 201,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Failed to create book:", error);
		return new Response(JSON.stringify({ error: "Failed to create book" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
}
