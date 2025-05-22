import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey, HasMany, Model,
  Table,
} from 'sequelize-typescript';
import { Assignment } from './assignment.model';
import { DiscussionThread } from './discussion_thread.model';
import { Professor } from './professor.model';
import { Room } from './room.model';
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
    text: string | null;

  @ForeignKey(() => Professor)
  @Column({ type: DataType.UUID, field: 'creatorId' })
    creatorId: string;

  @ForeignKey(() => Assignment)
  @Column({ type: DataType.UUID })
    assignmentId: string;

  @Column({ type: DataType.INTEGER, defaultValue: null })
    score: number | null;

  @Column({ type: DataType.STRING, defaultValue: null })
    priority: string | null;

  @Column({ type: DataType.DATE, defaultValue: null })
    startDate: Date | string | null;

  @Column({ type: DataType.DATE, defaultValue: null })
    endDate: Date | string | null;

  @Column({ type: DataType.JSONB, defaultValue: null })
    tags: string | null;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isAnswered: boolean;

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

  @HasMany(() => DiscussionThread, {
    foreignKey: 'task_id',
    as: 'discussionThread',
  })
    discussionThread: DiscussionThread[];

  @HasMany(() => Room, {
    foreignKey: 'task_id',
    as: 'room',
  })
    room: Room[];

  @HasMany(() => UserTask, {
    foreignKey: 'task_id',
    as: 'solutions',
  })
    solutions: UserTask[];
}
