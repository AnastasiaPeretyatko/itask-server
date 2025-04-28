import * as bcrypt from 'bcrypt';
import { BelongsToMany, Column, DataType, HasMany, HasOne, Model, Table } from 'sequelize-typescript';
import { DiscussionThread } from './discussion_thread.model';
import { Message } from './message.model';
import { Notification } from './notification.model';
import { Professor } from './professor.model';
import { Room } from './room.model';
import { Student } from './student.model';
import { UserRoom } from './user_room.model';

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

  @Column({ type: DataType.STRING })
    avatar: string;

  @Column({ type: DataType.STRING })
    fullName: string;

  @Column({ type: DataType.STRING })
    tel: string;

  @HasOne(() => Professor, {
    foreignKey: 'user_id',
    as: 'professor',
  })
    professor: Professor;

  @HasOne(() => Student, {
    foreignKey: 'user_id',
    as: 'student',
  })
    student: Student;

  @HasOne(() => DiscussionThread, {
    foreignKey: 'created_by',
    as: 'discussionThread',
  })
    discussionThread: DiscussionThread;

  @HasOne(() => Message, {
    foreignKey: 'author_id',
    as: 'message',
  })
    message: Message;

  @HasMany(() => Notification, {
    foreignKey: 'user_id',
    as: 'notifications',
  })
    notifications: Notification[];

  @BelongsToMany(() => Room, () => UserRoom)
    rooms: Room[];

  @HasOne(() => Room, {
    foreignKey: 'owner_id',
    as: 'room',
  })
    room: Room;

  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  static async comparePassword(password: string, user: User): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }
}
