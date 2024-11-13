import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Degree } from 'src/common/enum/degree';
import { EducationMode } from 'src/common/enum/education-mode';
import { University } from './university.model';

@Table({ tableName: 'groups' })
export class Group extends Model<Group> {
  @Column({
    type: DataType.UUID,
    unique: true,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => University)
  @Column({ type: DataType.UUID, field: 'university_id' })
  universityId: string;

  @Column({ type: DataType.ENUM(...Object.values(Degree)) })
  degree: string;

  @Column({
    type: DataType.ENUM(...Object.values(EducationMode)),
    field: 'education_mode',
  })
  educationMode: string;

  @Column({ type: DataType.INTEGER })
  course: number;

  @Column({ type: DataType.INTEGER, field: 'group_number' })
  groupNumber: number;

  @Column({
    type: DataType.VIRTUAL,
    get(this: Group) {
      const universityMap = {
        ИКТИБ: 'КТ',
        ИРТСУ: 'ИР',
        ИНЭП: 'ЭП',
        ИУЭС: 'УЭ',
      };

      const degreeMap = {
        bachelor: 'б',
        specialist: 'с',
        master: 'м',
      };

      const modeMap = {
        'full-time': 'о',
        extramural: 'з',
      };

      const universityName = this.getDataValue('university')?.name || '';
      const universityCode = universityMap[universityName] || '';
      const degreeCode = degreeMap[this.degree] || '';
      const modeCode = modeMap[this.educationMode] || '';

      return `${universityCode}${degreeCode}${modeCode}${this.course}-${this.groupNumber}`;
    },
  })
  groupCode: string;

  @CreatedAt
  created_at: Date

  @UpdatedAt
  updated_at: Date

  @BelongsTo(() => University, {
    foreignKey: 'university_id',
    onDelete: 'CASCADE',
    as: 'university',
  })
  university: University;
}
