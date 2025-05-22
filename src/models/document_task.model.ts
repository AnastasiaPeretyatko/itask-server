import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Document } from './documents.model';
import { UserTask } from './user_task.model';


@Table({ tableName: 'document_task' })
export class DocumentTask extends Model<DocumentTask> {
  @Column({
    type: DataType.UUID,
    unique: true,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
    id: string;

  @ForeignKey(() => UserTask)
  @Column({ type: DataType.UUID })
    userTaskId: string;

  @ForeignKey(() => Document)
  @Column({ type: DataType.UUID })
    documentId: string;
}