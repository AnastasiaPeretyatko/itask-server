import { z } from 'zod';

export const UpdateAssignmentSchema = z.object({
  id: z.string().optional(),
  courseId: z.string(),
  groupId: z.string(),
  professorId: z.string().optional(),
  semesterId: z.string().optional(),
});

export type UpdateAssignmentDto = z.infer<typeof UpdateAssignmentSchema>;