import {
  BelongsTo, Column, DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Course } from './courses.model';
import { Group } from './group.model';
import { Professor } from './professor.model';
import { Semester } from './semester.model';
import { Task } from './tasks.model';

@Table({ tableName: 'assignment' })
export class Assignment extends Model<Assignment> {
  @Column({
    type: DataType.UUID,
    unique: true,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
    id: string;

  @ForeignKey(() => Course)
  @Column({ type: DataType.UUID })
    courseId: string;

  @ForeignKey(() => Professor)
  @Column({ type: DataType.UUID, allowNull: true })
    professorId: string | null;

  @ForeignKey(() => Group)
  @Column({ type: DataType.UUID, allowNull: true })
    groupId: string | null;

  @ForeignKey(() => Semester)
  @Column({ type: DataType.UUID, allowNull: true })
    semesterId: string | null;

  @BelongsTo(() => Course, { foreignKey: 'courseId', onDelete: 'CASCADE', as: 'course' })
    course: Course;

  @BelongsTo(() => Professor, { foreignKey: 'professorId', onDelete: 'CASCADE', as: 'professor' })
    professor: Professor;

  @BelongsTo(() => Group, { foreignKey: 'groupId', onDelete: 'CASCADE', as: 'group' })
    group: Group;

  @BelongsTo(() => Semester, { foreignKey: 'semesterId', onDelete: 'CASCADE', as: 'semester' })
    semester: Semester;

  @HasMany(() => Task)
    tasks: Task[];
}

