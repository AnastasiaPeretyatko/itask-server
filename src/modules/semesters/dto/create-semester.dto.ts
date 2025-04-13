import { z } from 'zod';

export const SemesterSchema = z.object({
  name: z.string().default(''),
  startDate: z.coerce.date(),
  endDate:z.coerce.date(),
});

export type SemesterDto = z.infer<typeof SemesterSchema>;
