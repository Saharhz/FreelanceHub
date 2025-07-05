import { z } from 'zod';

export const CreateJobZod = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
  skillsRequired: z.array(z.string()).optional(),
  budget: z.number().positive(),
  deadline: z.coerce.date(),
  visibility: z.enum(['public', 'inactive-only']).default('public'),
});

export type CreateJobDto = z.infer<typeof CreateJobZod>;
