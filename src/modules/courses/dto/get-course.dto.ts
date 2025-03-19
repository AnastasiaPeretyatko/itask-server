import { z } from 'zod';

export const GetCoursesSchema = z.object({
  search: z.string().optional().default(''),
  limit: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
});

export type GetCoursesDto = z.infer<typeof GetCoursesSchema>;