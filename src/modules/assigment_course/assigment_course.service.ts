import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateAssignmentDto } from './dto/create-assinment.dto';
import { UpdateAssignmentDto } from './dto/update-assinment.dto';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { CourseAssignment } from 'src/models/course_assignment.model';
import { Group } from 'src/models/group.model';
import { Professor } from 'src/models/professor.model';
import { Semester } from 'src/models/semester.model';
import { University } from 'src/models/university.model';
import { User } from 'src/models/user.model';

@Injectable()
export class AssigmentCourseService {
  constructor(
    @InjectModel(CourseAssignment) private courseAssignmentRepository: typeof CourseAssignment,
  ) {}

  async create(dto: CreateAssignmentDto) {
    return await this.courseAssignmentRepository.create(dto);
  }

  async find(id: string) {
    return await this.courseAssignmentRepository.findOne({
      where: { id },
      include: [
        {
          model: Professor,
          as: 'professors',
          include: [
            {
              model: User,
              as: 'user',
            },
          ],
        },
        {
          model: Group,
          as: 'groups',
          include: [
            {
              model: University,
              as: 'university',
            },
          ],
        },
        {
          model: Semester,
          as: 'semesters',
        },
      ],
    });
  }

  async addProfessor(dto: UpdateAssignmentDto){
    const { id, professor_id } = dto;
    const assignment = await this.courseAssignmentRepository.findByPk(id);

    if(assignment.professor_id !== professor_id && assignment.professor_id){
      const newAssignment = await this.create(dto);
      return { data: newAssignment, message: 'Связь обновлена' };
    }

    if(!assignment.professor_id){
      assignment.professor_id = professor_id;
      assignment.save();
      return { data: assignment, message: 'Связь обновлена' };
    }
  }

  async addSemester(dto: UpdateAssignmentDto){
    const { id, semester_id } = dto;
    const assignment = await this.courseAssignmentRepository.findByPk(id);

    if(assignment.semester_id !== semester_id && assignment.semester_id){
      const newAssignment = await this.create(dto);
      return { data: newAssignment, message: 'Связь обновлена' };
    }

    if(!assignment.semester_id){
      assignment.semester_id = semester_id;
      assignment.save();
      return { data: assignment, message: 'Связь обновлена' };
    }
  }

  async addNewGroup(dto: UpdateAssignmentDto){
    const assignment = await this.create(dto);
    return { data: assignment, message: 'Связь обновлена' };
  }

  async update(dto: UpdateAssignmentDto) {
    const { id, semester_id, professor_id } = dto;

    // Флаг для отслеживания изменений
    let hasChanges = false;

    if (!id) {
      const newAssignment = await this.create(dto);
      const data = await this.find(newAssignment.id);
      return { data, message: 'Новая связь создана' };
    }

    const assignment = await this.courseAssignmentRepository.findByPk(id);

    if (!assignment) {
      throw ApiException.badRequest('Запись не найдена');
    }

    if (professor_id !== undefined) {
      if (assignment.professor_id !== professor_id && assignment.professor_id) {
        const { id, ...rest } = dto;
        const newAssignment = await this.create(rest);
        const data = await this.find(newAssignment.id);
        return { data, message: 'Новая связь создана' };
      }

      if (assignment.professor_id === null) {
        assignment.professor_id = professor_id;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        hasChanges = true;
      }
    }

    if (semester_id !== undefined) {
      if (assignment.semester_id !== semester_id && assignment.semester_id) {
        const { id, ...rest } = dto;
        const newAssignment = await this.create(rest);
        const data = await this.find(newAssignment.id);
        return { data, message: 'Новая связь создана' };
      }

      if (!assignment.semester_id) {
        assignment.semester_id = semester_id;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        hasChanges = true;
      }
    }

    if (hasChanges) {
      await assignment.save();
      const data = this.find(assignment.id);
      return { data, message: 'Связь обновлена' };
    }

    throw ApiException.badRequest('Не было изменений');
  }

  async getRecordForGroup( id: string){
    const assignments = await this.courseAssignmentRepository.findAll({
      where: { course_id: id },
      attributes: ['id'],
      include: [
        {
          model: Professor,
          as: 'professors',
          include: [
            {
              model: User,
              as: 'user',
            },
          ],
        },
        {
          model: Group,
          as: 'groups',
          include: [
            {
              model: University,
              as: 'university',
            },
          ],
        },
        {
          model: Semester,
          as: 'semesters',
        },
      ],
    });

    const groupsId = [...new Set(assignments.map((g) => g.groups ? g.groups.id : null)) as unknown as string[]].filter((el) => el !== null);

    if (!groupsId.length) {
      throw ApiException.badRequest('Запись не найдена');
    }

    const groupsData = groupsId.map((gId, indx) => {
      const acc = [];
      assignments.forEach((data) => {
        const { professors, semesters, groups, id } = data;
        if (data.groups && data.groups.id === gId) {
          // Инициализация acc[indx], если он еще не существует
          if (!acc[indx]) {
            acc[indx] = {
              id,
              group: groups,
              professors: [],
              semesters: [],
            };
          }

          // Добавление professors, если они не равны null
          if (professors) {
            acc[indx].professors.push(...(Array.isArray(professors) ? professors : [professors]));
          }

          // Добавление semesters, если они не равны null
          if (semesters) {
            acc[indx].semesters.push(...(Array.isArray(semesters) ? semesters : [semesters]));
          }
        }
      });
      return acc[indx] || { groups: null, professors: [], semesters: [] }; // Возвращаем acc[indx] или объект по умолчанию
    });

    return groupsData;
  }
}