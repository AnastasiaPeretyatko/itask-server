import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { Message } from './message.model';
import { Task } from './tasks.model';
import { User } from './user.model';

@Table({ tableName: 'discussion_thread' })
export class DiscussionThread extends Model<DiscussionThread> {
  @Column({
    type: DataType.UUID,
    unique: true,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Task)
  @Column({ type: DataType.UUID })
  task_id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  created_by: string;

  @Column({ type: DataType.STRING })
  access_role: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Task)
  task: Task;

  @BelongsTo(() => User)
  user: User;

  @HasOne(() => Message, {
    foreignKey: 'thread_id',
    as: 'messages',
  })
  message: Message;
}
