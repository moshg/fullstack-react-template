import { z } from "zod";

export const bookCreateModelSchema = z
	.object({
		title: z.string().min(1, "Title is required"),
		author: z.string().min(1, "Author is required"),
		publishYear: z
			.number()
			.int()
			.min(1000, "Year must be at least 1000")
			.max(new Date().getFullYear(), "Year cannot be in the future")
			.optional(),
		categoryIds: z.array(z.number().int()),
	})
	.brand<"BookCreateModel">();

export type BookCreateModel = z.infer<typeof bookCreateModelSchema>;
