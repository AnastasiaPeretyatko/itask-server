import { z } from 'zod';

export const MessageSchema = z.object({
  room_id: z.string(),
  content: z.string(),
  parent_id: z.string().optional().default(null),
  task_id: z.string().optional().default(null),

  // universityId: z.string(),
  // degree: z.enum(Object.values(Degree) as [string, ...string[]]),
  // educationMode: z.enum(Object.values(EducationMode) as [string, ...string[]]),
  // course: z.coerce.number().int().positive(),
  // groupNumber: z.coerce.number().int().positive(),
});

export type MessageCreateDto = z.infer<typeof MessageSchema>;
