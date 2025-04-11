import { z } from 'zod';

export const GetAllTaskSchema = z.object({
  courseId: z.string(),
  semesterId: z.string().optional(),
  groupId: z.string().optional(),
});

export type GetAllTaskDto = z.infer<typeof GetAllTaskSchema>;
