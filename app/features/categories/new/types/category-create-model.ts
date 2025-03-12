import { z } from "zod";

export const categoryCreateSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
});

export type CategoryCreateModel = z.infer<typeof categoryCreateSchema>;
