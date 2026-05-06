import { z } from "zod";

export const createItemSchema = z.object({
  title: z.string().trim().min(1, "Title must not be empty"),
  description: z.union([z.string(), z.null()]).optional(),
  status: z.string().trim().min(1).optional(),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;

export const updateItemSchema = z
  .object({
    title: z.string().trim().min(1, "Title must not be empty").optional(),
    description: z.union([z.string(), z.null()]).optional(),
    status: z.string().trim().min(1, "Status must not be empty").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one of: title, description, status.",
  });

export type UpdateItemInput = z.infer<typeof updateItemSchema>;
