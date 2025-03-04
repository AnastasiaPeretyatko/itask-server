import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CourseAssignment } from './course_assignment.model';
import { SemesterGroupCourse } from './semester-group-course.model';
import { SemesterGroup } from './semester-group.model';

@Table({ tableName: 'courses' })
export class Course extends Model<Course> {
  @Column({
    type: DataType.UUID,
    unique: true,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
    id: string;

  @Column({ type: DataType.STRING, allowNull: false })
    name: string;

  @Column({ type: DataType.TEXT })
    description: string | null;

  @CreatedAt
    createdAt: Date;

  @UpdatedAt
    updatedAt: Date;

  @BelongsToMany(() => SemesterGroup, () => SemesterGroupCourse, 'course_id', 'semester_group_id')
    semesterGroups: SemesterGroup[];

  // new changes

  @HasMany(() => CourseAssignment, { as: 'course_assignment' })
    courseAssignments: CourseAssignment[];
}

