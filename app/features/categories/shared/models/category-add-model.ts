import { z } from "zod";

export const categoryAddModelSchema = z
	.object({
		name: z.string().min(1, "Name is required"),
		description: z.string().optional(),
	})
	.brand<"CategoryCreateModel">();

export type CategoryCreateModel = z.infer<typeof categoryAddModelSchema>;
