import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { Group } from './group.model';

@Table({ tableName: 'university' })
export class University extends Model<University> {
  @Column({
    type: DataType.UUID,
    unique: true,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({ type: DataType.ENUM('ИКТИБ', 'ИРТСУ', 'ИНЭП', 'ИУЭС') })
  name: string;

  @HasOne(() => Group, {
    foreignKey: 'university_id',
    as: 'university',
  })
  group: Group;
}
