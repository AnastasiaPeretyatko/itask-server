import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Course } from './courses.model';
import { SemesterGroup } from './semester-group.model';

@Table({ tableName: 'semester_group_course' })
export class SemesterGroupCourse extends Model<SemesterGroupCourse> {
  @Column({
    type: DataType.UUID,
    unique: true,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => SemesterGroup)
  @Column({ type: DataType.UUID, field: 'semester_group_id' })
  semesterGroupId: string;

  @ForeignKey(() => Course)
  @Column({ type: DataType.UUID, field: 'course_id' })
  courseId: string;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @BelongsTo(() => SemesterGroup, 'semester_group_id')
  semesterGroup: SemesterGroup;

  @BelongsTo(() => Course, 'course_id')
  course: Course;
}
