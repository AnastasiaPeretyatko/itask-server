import { z } from 'zod';

export const CreateTaskSchema = z.object({
  assignment: z.object({
    courseId: z.string().min(1, 'Course ID is required'),
    groupId: z.string().optional(),
    semesterId: z.string().optional(),
  }),
  task: z.object({
    id: z.string().optional(), // Если это для существующих задач
    title: z.string().min(1, 'Title is required'),
    text: z.string().optional(),
    to_studentId: z.string().nullable().optional(), // Чёткое указание
    creatorId: z.string().min(1, 'Creator ID is required'),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
    score: z.number().optional().nullable(),
    priority: z.string().optional().nullable(),
    status: z.string().optional().nullable(),
  }),
});

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;
