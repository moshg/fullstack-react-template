import { db } from "~/config/drizzle";
import { categoriesTable } from "~/db/schema";

/**
 * Returns a list of all categories
 */
export async function loader() {
	try {
		// Fetch all categories
		const categories = await db.select().from(categoriesTable);

		return { categories };
	} catch (error) {
		console.error("Failed to fetch categories:", error);
		return new Response(
			JSON.stringify({ error: "Failed to fetch categories" }),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}
}
