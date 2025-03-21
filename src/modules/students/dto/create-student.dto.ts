import { z } from 'zod';

export const StudentSchema = z.object({
  email: z.string(),
  groupId: z.string(),
  fullName: z.string(),
  tel: z.string(),
});

export type StudentDto = z.infer<typeof StudentSchema>;
