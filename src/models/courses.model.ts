import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Assignment } from './assignment.model';

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

  // new changes

  @HasMany(() => Assignment, { as: 'assignment' })
    assignments: Assignment[];
}

