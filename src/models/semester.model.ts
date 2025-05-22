import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Assignment } from './assignment.model';
import { Course } from './courses.model';
import { Group } from './group.model';
import { Professor } from './professor.model';

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

  // new changes

  @BelongsToMany(() => Course, () => Assignment)
    courses: Course[];

  @BelongsToMany(() => Group, () => Assignment)
    groups: Group[];

  @BelongsToMany(() => Professor, () => Assignment)
    professors: Professor[];
}
