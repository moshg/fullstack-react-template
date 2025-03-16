import { z } from "zod";

export const bookCreateModelSchema = z.object({
	title: z.string().min(1, "Title is required"),
	author: z.string().min(1, "Author is required"),
	publishYear: z
		.string()
		.optional()
		.transform((val) => (val ? Number.parseInt(val, 10) : undefined))
		.pipe(
			z
				.number()
				.min(1000, "Year must be at least 1000")
				.max(new Date().getFullYear(), "Year cannot be in the future")
				.optional(),
		),
	categoryIds: z
		.array(z.string())
		.transform((val) => val.map((id) => Number(id))),
});

export type BookCreateModel = z.infer<typeof bookCreateModelSchema>;
