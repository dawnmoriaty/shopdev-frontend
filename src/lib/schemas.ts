// src/lib/schemas.ts
import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(2).max(100),
  status: z.boolean(),
});

export const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  unitPrice: z.number().positive(),
  imageUrl: z.string().url().optional(),
  categoryId: z.number().positive(),
});