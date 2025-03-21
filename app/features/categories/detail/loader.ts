import { eq } from "drizzle-orm";
import type { ServerContext } from "~/server/context";
import { categories } from "~/server/db/schema";

export async function categoryLoader(ctx: ServerContext, id: string) {
	const { db } = ctx;
	const categoryId = Number.parseInt(id, 10);

	if (Number.isNaN(categoryId)) {
		return { category: null };
	}

	const category = await db.query.categories.findFirst({
		where: eq(categories.id, categoryId),
	});

	return { category: category ?? null };
}
