import { Column, CreatedAt, DataType, DeletedAt, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';

import { Room } from './room.model';
import { User } from './user.model';

@Table({ tableName: 'user_room' })
export class UserRoom extends Model<UserRoom> {
  @Column({
    type: DataType.UUID,
    unique: true,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  user_id: string;

  @ForeignKey(() => Room)
  @Column({ type: DataType.UUID })
  room_id: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}
