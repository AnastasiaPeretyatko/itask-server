import { Degree, EducationMode } from 'src/common/enum';

export class CreateGroupDto {
  readonly universityId: string;
  readonly degree: Degree;
  readonly educationMode: EducationMode;
  readonly course: number;
  readonly groupNumber: number;
}
