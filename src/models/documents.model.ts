import { BelongsTo, BelongsToMany, Column, CreatedAt, DataType, DeletedAt, ForeignKey, HasMany, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { DocumentTask } from './document_task.model';
import { User } from './user.model';
import { UserTask } from './user_task.model';

@Table({ tableName: 'documents' })
export class Document extends Model<Document> {
  @Column({
    type: DataType.UUID,
    unique: true,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
    id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
    creatorId: string;

  @ForeignKey(() => Document)
  @Column({ type: DataType.UUID, defaultValue: null })
    parentId: string;

  @Column({ type: DataType.STRING })
    title: string;

  @Column({ type: DataType.JSONB, defaultValue: null })
    context: string;

  @Column({ type: DataType.STRING })
    type: string;

  @Column({ type: DataType.STRING, defaultValue: null })
    path: string;

  @CreatedAt
    createdAt: Date;

  @UpdatedAt
    updatedAt: Date;

  @DeletedAt
    deletedAt: Date;

  @BelongsTo(() => Document, 'parentId')
    parent: Document;

  @HasMany(() => Document, 'parentId')
    children: Document[];

  @BelongsToMany(() => UserTask, () => DocumentTask)
    tasks: UserTask[];
}
