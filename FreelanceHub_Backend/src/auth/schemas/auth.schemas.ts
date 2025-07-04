// src/auth/schemas/auth.schemas.ts
import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['client', 'freelancer']),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
