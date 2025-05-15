import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Student } from './student.model';
import { Task } from './tasks.model';
import { TaskStatus } from 'src/common/enum/task';

@Table({ tableName: 'user_task' })
export class UserTask extends Model<UserTask> {
  @Column({
    type: DataType.UUID,
    unique: true,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
    id: string;

  @Column({ type: DataType.ENUM('NEW', 'REOPENED', 'RESOLVED', 'CLOSED'), allowNull: false, defaultValue: 'NEW' })
    status: TaskStatus;

  @Column({ type: DataType.INTEGER, defaultValue: null })
    grade: number;

  @Column({ type: DataType.DECIMAL(40, 30), defaultValue: 0 })
    o: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
    isActive: boolean;

  @Column({ type: DataType.JSONB, defaultValue: null })
    answer: string | null;

  @ForeignKey(() => Task)
  @Column({ type: DataType.UUID })
    task_id: string;

  @ForeignKey(() => Student)
  @Column({ type: DataType.UUID })
    student_id: string;

  @BelongsTo(() => Task)
    task: Task;

  @BelongsTo(() => Student)
    student: Student;
}
