import { Injectable, Query, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { Professor } from 'src/models/professor.model';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { CreateProfessorCourseDto } from './dto/create.professor-course.dto';
import { SemesterGroupCourseService } from '../semester-group-course/semester-group-course.service';
import { ProfessorCourse } from 'src/models/professor-course.model';
import { SemesterGroupCourse } from 'src/models/semester-group-course.model';
import { Course } from 'src/models/courses.model';
import { SemesterGroup } from 'src/models/semester-group.model';
import { Semester } from 'src/models/semester.model';
import { Group } from 'src/models/group.model';
import { University } from 'src/models/university.model';

@Injectable()
export class ProfessorCourseService {
  constructor(
    private readonly semesterGroupCourseService: SemesterGroupCourseService,
    @InjectModel(ProfessorCourse)
    private professorCourseRepository: typeof ProfessorCourse,
  ) {
    // @InjectModel(User) private userRepository: typeof User, // @InjectModel(Professor) private professorRepository: typeof Professor,
  }

  async getOne(id: string) {
    const data = await this.professorCourseRepository.findOne({
      where: { id },
      include: [
        {
          model: Professor,
          as: 'professor',
        },
        {
          model: SemesterGroupCourse,
          as: 'semesterGroupCourse',
          include: [
            {
              model: Course,
              as: 'course',
            },
            {
              model: SemesterGroup,
              as: 'semesterGroup',
            },
          ],
        },
      ],
    });
    return data;
  }

  async create({
    courseId,
    groupId,
    position,
    professorId,
    semesterId,
  }: CreateProfessorCourseDto) {
    const semesterGroupCourseId = await this.semesterGroupCourseService.getById(
      courseId,
      groupId,
      semesterId,
    );

    const data = await this.professorCourseRepository.create({
      professorId,
      semesterGroupCourseId,
      position,
    });

    return {
      data: await this.getOne(data.id),
      message: {
        title: 'Профессор успешно добавлен',
        description: '',
      },
    };
  }

  async getAllProfessors(id: string) {
    const data = await this.professorCourseRepository.findAll({
      include: [
        {
          model: Professor,
          as: 'professor',
        },
        {
          model: SemesterGroupCourse,
          as: 'semesterGroupCourse',
          required: true,
          include: [
            {
              model: Course,
              as: 'course',
              where: { id },
            },
            {
              model: SemesterGroup,
              as: 'semesterGroup',
              include: [
                {
                  model: Semester,
                  as: 'semester',
                },
                {
                  model: Group,
                  as: 'group',
                  include: [
                    {
                      model: University,
                      as: 'university',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    return data;
  }
}
