import { z } from 'zod';

export const CreateCourseSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  professorIds: z.array(z.string()).optional(),
});

export type CreateCourseDto = z.infer<typeof CreateCourseSchema>;
