import { z } from 'zod';
import { Degree, EducationMode } from 'src/common/enum';

export const GroupSchema = z.object({
  universityId: z.string(),
  degree: z.enum(Object.values(Degree) as [string, ...string[]]),
  educationMode: z.enum(Object.values(EducationMode) as [string, ...string[]]),
  course: z.number(),
  groupNumber: z.number(),
});

export type GroupDto = z.infer<typeof GroupSchema>;
