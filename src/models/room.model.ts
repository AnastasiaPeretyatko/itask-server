import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { Message } from './message.model';
import { Task } from './tasks.model';
import { User } from './user.model';
import { UserRoom } from './user_room.model';

@Table({ tableName: 'room' })
export class Room extends Model<Room> {
  @Column({
    type: DataType.UUID,
    unique: true,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  owner_id: string;

  @Column({ type: DataType.STRING, defaultValue: null })
  title: string | null;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_private: boolean;

  @ForeignKey(() => Task)
  @Column({ type: DataType.UUID, defaultValue: null })
  task_id: string | null;

  @Column({ type: DataType.ENUM('students', 'professors', 'all'), defaultValue: null })
  access: string | null;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @BelongsToMany(() => User, () => UserRoom)
  users: User[];

  @BelongsToMany(() => User, () => UserRoom)
  filteredUsers: User[];

  @HasMany(() => Message)
  messages: Message[];

  @BelongsTo(() => Task)
  task: Task;
}
