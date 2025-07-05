import { z } from 'zod';

export const UpdateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().optional(),
  bio: z.string().optional(),
  skills: z.union([z.string(), z.array(z.string())]).optional(),
  contact: z.string().email('Invalid contact email').optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
