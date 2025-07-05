import { z } from 'zod';
import { CreateJobZod } from './create-job.dto';

export const UpdateJobZod = CreateJobZod.partial();

export type UpdateJobDto = z.infer<typeof UpdateJobZod>;
