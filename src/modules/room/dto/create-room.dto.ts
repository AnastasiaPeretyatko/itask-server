import { z } from 'zod';

export const CreateRoomSchema = z.object({
  userIds: z.array(z.string()).optional(),
  title: z.string().default(null).optional(),
  task_id: z.string().optional(),
  access: z.string().optional(),
});

export type CreateRoomDto = z.infer<typeof CreateRoomSchema>;
