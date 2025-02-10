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
import { Group } from './group.model';
import { SemesterGroup } from './semester-group.model';
import { CourseAssignment } from './course_assignment.model';

@Table({ tableName: 'semesters' })
export class Semester extends Model<Semester> {
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
  name: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endDate: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsToMany(() => Group, () => SemesterGroup)
  groups: Group[];

  // new changes

  @HasMany(() => CourseAssignment)
  courseAssignments: CourseAssignment[];
}
