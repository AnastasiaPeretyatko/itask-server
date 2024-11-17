import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Semester } from './semester.model';
import { Group } from './group.model';

@Table({ tableName: 'semester_groups' })
export class SemesterGroup extends Model<SemesterGroup> {
  @Column({
    type: DataType.UUID,
    unique: true,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Semester)
  @Column({ type: DataType.UUID, field: 'semester_id' })
  semesterId: string;

  @ForeignKey(() => Group)
  @Column({ type: DataType.UUID, field: 'group_id' })
  groupId: string;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;
}
