import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Professor } from './professor.model';
import { SemesterGroupCourse } from './semester-group-course.model';
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    field: 'start_date',
    type: DataType.DATE,
  })
  startDate: Date;

  @Column({
    field: 'end_date',
    type: DataType.DATE,
  })
  endDate: Date;

  @ForeignKey(() => Professor)
  @Column({
    type: DataType.UUID,
    field: 'creator_id',
  })
  creatorId: string;

  @ForeignKey(() => SemesterGroupCourse)
  @Column({
    type: DataType.UUID,
    field: 'semester_group_course_id',
  })
  semesterGroupCourseId: string;

  @ForeignKey(() => Student)
  @Column({
    type: DataType.UUID,
    field: 'from_student_id',
  })
  fromStudentId: string;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @BelongsTo(() => Professor, {
    foreignKey: 'creator_id',
    onDelete: 'CASCADE',
    as: 'creator',
  })
  creator: Professor;

  @BelongsTo(() => SemesterGroupCourse, {
    foreignKey: 'semester_group_course_id',
    onDelete: 'CASCADE',
    as: 'semesterGroupCourse',
  })
  semesterGroupCourse: SemesterGroupCourse;

  @BelongsTo(() => Student, {
    foreignKey: 'from_student_id',
    onDelete: 'CASCADE',
    as: 'fromStudent',
  })
  fromStudent: Student;

  creator_id?: string;
  semester_group_course_id?: string;
  from_student_id?: string;

  toJSON() {
    const attributes = { ...this.get() }; // Получаем все данные модели
    // Удаляем дублирующие поля
    delete attributes.creator_id;
    delete attributes.semester_group_course_id;
    delete attributes.from_student_id;
    return attributes;
  }
}
