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

  @HasMany(() => Assignment)
    assignments: Assignment[];
}
