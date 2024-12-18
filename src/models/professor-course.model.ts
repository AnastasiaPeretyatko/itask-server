import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { SemesterGroupCourse } from './semester-group-course.model';
import { Professor } from './professor.model';

@Table({ tableName: 'professor_course' })
export class ProfessorCourse extends Model<ProfessorCourse> {
  @Column({
    type: DataType.UUID,
    unique: true,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Professor)
  @Column({ type: DataType.UUID, field: 'professor_id' })
  professorId: string;

  @ForeignKey(() => SemesterGroupCourse)
  @Column({ type: DataType.UUID, field: 'semester_group_course_id' })
  semesterGroupCourseId: string;

  @Column({ type: DataType.STRING })
  position: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Professor, 'professor_id')
  professor: Professor;

  @BelongsTo(() => SemesterGroupCourse, 'semester_group_course_id')
  semesterGroupCourse: SemesterGroupCourse;
}
