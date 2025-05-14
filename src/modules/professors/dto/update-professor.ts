import { z } from 'zod';

export const UpdateProfessorSchema = z.object({
  email: z.string().optional(),
  fullName: z.string().optional(),
  tel: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

export type UpdateProfessorDto = z.infer<typeof UpdateProfessorSchema>;
