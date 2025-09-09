import { z } from 'zod';

export const CreateAssignmentSchema = z.object({
  courseId: z.string(),
  groupId: z.string(),
  professorId: z.string().optional(),
  semesterId: z.string().optional(),
});

export type CreateAssignmentDto = z.infer<typeof CreateAssignmentSchema>;
