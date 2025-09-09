/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { z } from 'zod';

import { Degree, EducationMode } from 'src/common/enum';

export const UpdateGroupSchema = z.object({
  degree: z.enum(Object.values(Degree) as [string, ...string[]]),
  educationMode: z.enum(Object.values(EducationMode) as [string, ...string[]]),
  course: z.number(),
});

export type UpdateGroupDto = z.infer<typeof UpdateGroupSchema>;
