import { z } from 'zod';

export const UpdateAssignmentSchema = z.object({
  id: z.string().optional(),
  course_id: z.string(),
  group_id: z.string(),
  professor_id: z.string().optional(),
  semester_id: z.string().optional(),
});

export type UpdateAssignmentDto = z.infer<typeof UpdateAssignmentSchema>;