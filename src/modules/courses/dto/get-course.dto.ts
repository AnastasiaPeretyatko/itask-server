import { z } from 'zod';

export const GetCoursesSchema = z.object({
  search: z.string().optional().default(''),
  limit: z.number().optional(),
  page: z.number().optional(),
});

export type GetCoursesDto = z.infer<typeof GetCoursesSchema>;