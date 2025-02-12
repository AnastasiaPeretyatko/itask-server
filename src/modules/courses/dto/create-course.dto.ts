// import { z } from 'zod';

// export const CreateCourseDto = z.object({
//   name: z.string(),
//   description: z.string().optional(),
//   professorIds: z.array(z.string()).optional(),
// });

// export type CreateCourseDto = z.infer<typeof CreateCourseDto>;

export class CreateCourseDto {
  readonly name: string;
  readonly description: any;
  readonly professorIds?: string[];
}
