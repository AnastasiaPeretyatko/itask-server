import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey, Model,
  Table,
} from 'sequelize-typescript';
import { Assignment } from './assignment.model';
import { Professor } from './professor.model';
import { Student } from './student.model';
import { UserTask } from './user_task.model';

@Table({ tableName: 'task' })
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

  @Column({ type: DataType.JSONB, allowNull: true, defaultValue: null })
    text: string;

  @ForeignKey(() => Professor)
  @Column({ type: DataType.UUID, field: 'creatorId' })
    creatorId: string;

  @ForeignKey(() => Assignment)
  @Column({ type: DataType.UUID })
    assignmentId: string;

  @Column({ type: DataType.INTEGER, defaultValue: null })
    score: number;

  @Column({ type: DataType.STRING, defaultValue: null })
    priority: string;

  @Column({ type: DataType.DATE, defaultValue: null })
    startDate: Date | string;

  @Column({ type: DataType.DATE, defaultValue: null })
    endDate: Date | string;

  @Column({ type: DataType.JSONB, defaultValue: null })
    tags: string;

  @Column({ type: DataType.DATE })
    createdAt: Date;

  @Column({ type: DataType.DATE })
    updatedAt: Date;

  @BelongsTo(() => Professor, { foreignKey: 'creatorId', onDelete: 'CASCADE', as: 'creatorBy' })
    creatorBy: Professor;

  @BelongsTo(() => Assignment, { foreignKey: 'assignmentId', onDelete: 'CASCADE', as: 'assignment' })
    assignment: Assignment;

  @BelongsToMany(() => Student, () => UserTask)
    students: Student[];

  // public setUser_students!: (students: Student[] | string[], options?: any) => Promise<void>;
}
