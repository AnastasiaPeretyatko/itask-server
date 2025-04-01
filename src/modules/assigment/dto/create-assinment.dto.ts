import { z } from 'zod';

export const CreateAssignmentSchema = z.object({
  course_id: z.string(),
  group_id: z.string(),
  professor_id: z.string().optional(),
  semester_id: z.string().optional(),
});

export type CreateAssignmentDto = z.infer<typeof CreateAssignmentSchema>;