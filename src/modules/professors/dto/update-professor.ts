import { z } from 'zod';

export const UpdateProfessorSchema = z.object({
  email: z.string(),
  fullName: z.string(),
  description: z.string().optional(),
});

export type UpdateProfessorDto = z.infer<typeof UpdateProfessorSchema>;
