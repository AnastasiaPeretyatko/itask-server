import { z } from 'zod';

export const CreateCourseSchema = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  learning_form: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  assessment_system: z.string().optional().nullable(),
  access: z.string().optional().nullable(),
  professorIds: z.array(z.string()).optional(),
});

export type CreateCourseDto = z.infer<typeof CreateCourseSchema>;
