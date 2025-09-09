import { BelongsToMany, Column, CreatedAt, DataType, Model, Table, UpdatedAt } from 'sequelize-typescript';

import { Assignment } from './assignment.model';
import { Group } from './group.model';
import { Professor } from './professor.model';
import { Semester } from './semester.model';

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

  @Column({ type: DataType.STRING, allowNull: true })
  learning_form: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  language: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  assessment_system: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  access: string | null;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  // new changes

  @BelongsToMany(() => Professor, {
    through: () => Assignment,
    as: 'professors',
  })
  professors: Professor[];

  @BelongsToMany(() => Group, () => Assignment)
  groups: Group[];

  @BelongsToMany(() => Semester, () => Assignment)
  semesters: Semester[];
}
