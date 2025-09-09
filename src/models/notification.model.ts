import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';

import { Message } from './message.model';
import { User } from './user.model';

@Table({ tableName: 'notification' })
export class Notification extends Model<Notification> {
  @Column({
    type: DataType.UUID,
    unique: true,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Message)
  @Column({ type: DataType.UUID })
  message_id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  user_id: string;

  @Column({ type: DataType.STRING })
  type: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_read: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Message)
  message: Message;

  @BelongsTo(() => User)
  user: User;
}
