import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';

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

  @ForeignKey(() => Professor)
  @Column(DataType.UUID)
  professorId: string;

  @ForeignKey(() => Course)
  @Column(DataType.UUID)
  courseId: string;

  @ForeignKey(() => Group)
  @Column(DataType.UUID)
  groupId: string;

  @ForeignKey(() => Semester)
  @Column(DataType.UUID)
  semesterId: string;

  @BelongsTo(() => Professor)
  professor: Professor;

  @BelongsTo(() => Course)
  course: Course;

  @BelongsTo(() => Group)
  group: Group;

  @BelongsTo(() => Semester)
  semester: Semester;

  @HasMany(() => Task)
  tasks: Task[];
}
