import { z } from "zod";
import { bookCreateModelSchema } from "../../shared/models/book-create-model";

// Define use-case specific constraints and transformations
export const bookCreateRequestSchema = z
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

export type BookCreateRequest = z.infer<typeof bookCreateRequestSchema>;
