import { z } from 'zod';

export const ProfessorSchema = z.object({
  email: z.string(),
  fullName: z.string(),
});

export type ProfessorDto = z.infer<typeof ProfessorSchema>;
