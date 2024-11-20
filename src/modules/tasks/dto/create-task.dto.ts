export class CreateTaskDto {
  readonly title: string;
  readonly description: string;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly creatorId: string;
  readonly courseId: string;
  readonly groupId: string;
  readonly fromStudentId: string;
}
