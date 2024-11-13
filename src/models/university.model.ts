import { Column, DataType, Model, Table } from 'sequelize-typescript';

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
}
