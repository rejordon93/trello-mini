import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(2, "Username too short")
    .max(50, "Username too long")
    .optional(),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateUserSchema = z.object({
  firstname: z
    .string()
    .min(2, "First name too short")
    .max(50, "First name too long")
    .optional(),
  lastname: z
    .string()
    .min(2, "Last name too short")
    .max(50, "Last name too long")
    .optional(),
  email: z.string().email("Invalid email format").optional(),
  bio: z.string().max(200, "Bio must be under 200 characters").optional(),
});

export const listSchema = z.object({
  title: z.string().min(1, "Title is required"),
  position: z.number().int().min(0),
  boardId: z.number().int(),
});

export const boardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().max(200, "Description too long").optional(),
  position: z.number().int(),
});

export const cardSchema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().max(200).optional(),
  position: z.number().int().default(0), // ✅ default to 0
  listId: z.number(),
});

// Types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ListInput = z.infer<typeof listSchema>;
export type BoardInput = z.infer<typeof boardSchema>;
export type CardInput = z.infer<typeof cardSchema>;
