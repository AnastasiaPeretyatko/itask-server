import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Group } from './group.model';

@Table({ tableName: 'students' })
export class Student extends Model<Student> {
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

  @ForeignKey(() => Group)
  @Column({ type: DataType.UUID, field: 'group_id' })
  group_id: string;

  @Column({ type: DataType.STRING })
  fullName: string;

  @Column({ type: DataType.STRING })
  tel: string;

  @BelongsTo(() => Group, {
    foreignKey: 'group_id',
    onDelete: 'CASCADE',
    as: 'group',
  })
  group: Group;

  @BelongsTo(() => User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    as: 'user',
  })
  user: User;
}