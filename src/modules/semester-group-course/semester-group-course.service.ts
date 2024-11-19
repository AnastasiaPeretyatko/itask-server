import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { Course } from 'src/models/courses.model';
import { SemesterGroupCourse } from 'src/models/semester-group-course.model';
import { SemesterGroup } from 'src/models/semester-group.model';

@Injectable()
export class SemesterGroupCourseService {
  constructor(
    @InjectModel(SemesterGroupCourse)
    private semesterGroupCourseRepository: typeof SemesterGroupCourse,
    @InjectModel(SemesterGroup)
    private semesterGroupRepository: typeof SemesterGroup,
    @InjectModel(Course) private courseRepository: typeof Course,
  ) {}

  async getOne(semesterGroupId: string, courseId: string) {
    return await this.semesterGroupCourseRepository.findOne({
      where: { semesterGroupId, courseId },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ],
    });
  }

  async addSubjectToSemester({
    groupId,
    courseId,
  }: {
    groupId: string;
    courseId: string;
  }) {
    const semesterGroup = await this.semesterGroupRepository.findOne({
      where: { groupId },
    });

    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });

    if (!semesterGroup || !course)
      throw ApiException.notFound('Предмет не найден');

    await semesterGroup.$add('courses', course);

    return {
      data: await this.getOne(semesterGroup.id, course.id),
      message: {
        title: 'Предмет успешно добавлен',
        description: '',
      },
    };
  }

  async delete(semesterGroupId: string, courseId: string) {
    const { id } = await this.getOne(semesterGroupId, courseId);

    if (!id) throw ApiException.notFound('Предмет не найден');

    await this.semesterGroupCourseRepository.destroy({ where: { id } });

    return {
      message: 'Предмет успешно удален',
    };
  }

  async getSubjectsBySemesterAndGroup(groupId: string) {
    const data = await this.semesterGroupCourseRepository.findAll({
      attributes: ['id', 'semesterGroupId'],
      include: [
        {
          model: Course,
          as: 'course',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: SemesterGroup,
          as: 'semesterGroup',
          where: { groupId },
        },
      ],
    });

    if (!data) throw ApiException.notFound('Семестр не найден');

    const courses = data.map(({ course }) => course);

    if (!courses) throw ApiException.notFound('В семестре еще нет предметов');

    const subjects = {
      semesterGroupId: data[0].semesterGroupId,
      groupId: groupId,
      semesterId: data[0].semesterGroup.semesterId,
      courses,
    };

    return subjects;
  }
}
