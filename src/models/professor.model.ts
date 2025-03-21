import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Assignment } from './assignment.model';
import { Task } from './tasks.model';
import { User } from './user.model';

@Table({ tableName: 'professors' })
export class Professor extends Model<Professor> {
  @Column({
    type: DataType.UUID,
    unique: true,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
    id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'user_id' })
    user_id: string;

  @Column({ type: DataType.STRING })
    fullName: string;

  @Column({ type: DataType.STRING })
    tel: string;

  @Column({ type: DataType.STRING(256) })
    description: string;

  @BelongsTo(() => User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    as: 'user',
  })
    user: User;

  @HasMany(() => Task)
    tasks: Task[];

  // new changes

  @HasMany(() => Assignment)
    assignments: Assignment[];
}