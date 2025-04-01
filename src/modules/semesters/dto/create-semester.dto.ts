import { z } from 'zod';

export const SemesterSchema = z.object({
  name: z.string(),
  startDate: z.date(),
  endDate: z.date(),
});

export type SemesterDto = z.infer<typeof SemesterSchema>;
