import { SemesterGroup } from 'src/models/semester-group.model';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SemesterGroupService } from './semester-group.service';

@ApiTags('Семестры и группы')
@Controller('semesters-groups')
export class SemesterGroupController {
  constructor(private semesterGroupServise: SemesterGroupService) {}
}
