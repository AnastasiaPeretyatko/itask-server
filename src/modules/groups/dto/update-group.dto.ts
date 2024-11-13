import { Degree, EducationMode } from 'src/common/enum';

export class UpdateGroupDto {
  readonly degree: Degree;
  readonly education_mode: EducationMode;
  readonly course: number;
}