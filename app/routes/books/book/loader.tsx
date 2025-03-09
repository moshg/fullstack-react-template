import { eq } from "drizzle-orm";
import { db } from "~/config/drizzle";
import { booksTable } from "~/db/schema";

/**
 * Returns a specific book by ID
 */
export async function loader({ params }: { params: { id: string } }) {
	try {
		const id = Number.parseInt(params.id, 10);

		if (Number.isNaN(id)) {
			return new Response(JSON.stringify({ error: "Invalid book ID" }), {
				status: 400,
				headers: {
					"Content-Type": "application/json",
				},
			});
		}

		const book = await db
			.select()
			.from(booksTable)
			.where(eq(booksTable.id, id))
			.get();

		if (!book) {
			return new Response(JSON.stringify({ error: "Book not found" }), {
				status: 404,
				headers: {
					"Content-Type": "application/json",
				},
			});
		}

		return { book };
	} catch (error) {
		console.error(`Failed to fetch book with ID ${params.id}:`, error);
		return new Response(JSON.stringify({ error: "Failed to fetch book" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
}
