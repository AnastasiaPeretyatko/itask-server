import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Professor } from './professor.model';
import { Student } from './student.model';

@Table({ tableName: 'tasks' })
export class Task extends Model<Task> {
  @Column({
    type: DataType.UUID,
    unique: true,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
    id: string;

  @Column({ type: DataType.STRING, allowNull: false })
    title: string;

  @Column({ type: DataType.STRING, allowNull: false })
    description: string;

  @Column({
    field: 'startDate',
    type: DataType.DATE,
  })
    startDate: Date;

  @Column({
    field: 'endDate',
    type: DataType.DATE,
  })
    endDate: Date;

  @ForeignKey(() => Professor)
  @Column({
    type: DataType.UUID,
    field: 'creatorId',
  })
    creatorId: string;

  @ForeignKey(() => Student)
  @Column({
    type: DataType.UUID,
    field: 'fromStudentId',
  })
    fromStudentId: string;

  @Column({ type: DataType.DATE })
    createdAt: Date;

  @Column({ type: DataType.DATE })
    updatedAt: Date;

  @BelongsTo(() => Professor, {
    foreignKey: 'creatorId',
    onDelete: 'CASCADE',
    as: 'creator',
  })
    creator: Professor;

  @BelongsTo(() => Student, {
    foreignKey: 'fromStudentId',
    onDelete: 'CASCADE',
    as: 'fromStudent',
  })
    fromStudent: Student;
}
