import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { Professor } from './professor.model';
import * as bcrypt from 'bcrypt';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    unique: true,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, allowNull: false })
  role: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isActivated: boolean;

  @Column({ type: DataType.STRING })
  activationLink: string;

  @HasOne(() => Professor, {
    foreignKey: 'user_id',
    as: 'professor',
  })
  professor: Professor;

  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
