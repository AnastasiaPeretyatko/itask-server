import {
  BelongsTo, Column, DataType,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript';
import { Course } from './courses.model';
import { Professor } from './professor.model';
import { Group } from './group.model';
import { Semester } from './semester.model';

@Table({ tableName: 'course_assignment' })
export class CourseAssignment extends Model<CourseAssignment> {
  @Column({
    type: DataType.UUID,
    unique: true,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Course)
  @Column({ type: DataType.UUID, field: 'course_id' })
  course_id: string;

  @ForeignKey(() => Professor)
  @Column({ type: DataType.UUID, field: 'professor_id' })
  professor_id: string | null;

  @ForeignKey(() => Group)
  @Column({ type: DataType.UUID, field: 'group_id', allowNull: true })
  group_id: string | null;

  @ForeignKey(() => Semester)
  @Column({ type: DataType.UUID, field: 'semester_id', allowNull: true })
  semester_id: string | null;

  @BelongsTo(() => Course, {
    foreignKey: 'course_id',
    onDelete: 'CASCADE',
    as: 'courses',
  })
  course: Course;

  @BelongsTo(() => Professor, {
    foreignKey: 'professor_id',
    onDelete: 'CASCADE',
    as: 'professors',
  })
  professors: Professor;

  @BelongsTo(() => Group, {
    foreignKey: 'group_id',
    onDelete: 'CASCADE',
    as: 'groups',
  })
  groups: Group;

  @BelongsTo(() => Semester, {
    foreignKey: 'semester_id',
    onDelete: 'CASCADE',
    as: 'semesters',
  })
  semesters: Semester;
}

