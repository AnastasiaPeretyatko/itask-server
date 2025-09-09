import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { DiscussionThread } from './discussion_thread.model';
import { Notification } from './notification.model';
import { Room } from './room.model';
import { User } from './user.model';

@Table({ tableName: 'message' })
export class Message extends Model<Message> {
  @Column({
    type: DataType.UUID,
    unique: true,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => DiscussionThread)
  @Column({ type: DataType.UUID, defaultValue: null })
  thread_id: string | null;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  author_id: string;

  @ForeignKey(() => Room)
  @Column({ type: DataType.UUID })
  room_id: string;

  @Column({ type: DataType.STRING })
  content: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_deleted: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_edited: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_important: boolean;

  @ForeignKey(() => Message)
  @Column({ type: DataType.UUID, defaultValue: null })
  parent_id: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => DiscussionThread)
  thread: DiscussionThread;

  @BelongsTo(() => User)
  author: User;

  @HasMany(() => Notification, {
    foreignKey: 'message_id',
    as: 'notifications',
  })
  notifications: Notification[];

  @BelongsTo(() => Room)
  room: Room;

  @BelongsTo(() => Message, 'parent_id')
  parent: Message;

  @HasMany(() => Message, 'parent_id')
  children: Message[];
}
