import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateAssignmentDto } from './dto/create-assinment.dto';
import { UpdateAssignmentDto } from './dto/update-assinment.dto';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { Assignment } from 'src/models/assignment.model';
import { Course } from 'src/models/courses.model';
import { Group } from 'src/models/group.model';
import { Professor } from 'src/models/professor.model';
import { Semester } from 'src/models/semester.model';
import { University } from 'src/models/university.model';
import { User } from 'src/models/user.model';

@Injectable()
export class AssigmentService {
  constructor(
    @InjectModel(Assignment) private assignmentRepository: typeof Assignment,
  ) {}

  async create(dto: CreateAssignmentDto) {
    return await this.assignmentRepository.create(dto);
  }

  async find(id: string) {
    return await this.assignmentRepository.findOne({
      where: { id },
      include: [
        {
          model: Professor,
          as: 'professor',
          include: [
            {
              model: User,
              as: 'user',
            },
          ],
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
        {
          model: Semester,
          as: 'semester',
        },
      ],
    });
  }

  async addProfessor(dto: UpdateAssignmentDto){
    const { id, professorId } = dto;
    const assignment = await this.assignmentRepository.findByPk(id);

    if(assignment.professorId !== professorId && assignment.professorId){
      const newAssignment = await this.create(dto);
      return { data: newAssignment, message: 'Связь обновлена' };
    }

    if(!assignment.professorId){
      assignment.professorId = professorId;
      assignment.save();
      return { data: assignment, message: 'Связь обновлена' };
    }
  }

  async addSemester(dto: UpdateAssignmentDto){
    const { id, semesterId } = dto;
    const assignment = await this.assignmentRepository.findByPk(id);

    if(assignment.semesterId !== semesterId && assignment.semesterId){
      const newAssignment = await this.create(dto);
      return { data: newAssignment, message: 'Связь обновлена' };
    }

    if(!assignment.semesterId){
      assignment.semesterId = semesterId;
      assignment.save();
      return { data: assignment, message: 'Связь обновлена' };
    }
  }

  async addNewGroup(dto: UpdateAssignmentDto){
    const assignment = await this.create(dto);
    return { data: assignment, message: 'Связь обновлена' };
  }

  async update(dto: UpdateAssignmentDto) {
    const { id, semesterId, professorId } = dto;

    // Флаг для отслеживания изменений
    let hasChanges = false;

    if (!id) {
      const newAssignment = await this.create(dto);
      const data = await this.find(newAssignment.id);
      return { data, message: 'Новая связь создана' };
    }

    const assignment = await this.assignmentRepository.findByPk(id);

    if (!assignment) {
      throw ApiException.badRequest('Запись не найдена');
    }

    if (professorId !== undefined) {
      if (assignment.professorId !== professorId && assignment.professorId) {
        const { id, ...rest } = dto;
        const newAssignment = await this.create(rest);
        const data = await this.find(newAssignment.id);
        return { data, message: 'Новая связь создана' };
      }

      if (assignment.professorId === null) {
        assignment.professorId = professorId;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        hasChanges = true;
      }
    }

    if (semesterId !== undefined) {
      if (assignment.semesterId !== semesterId && assignment.semesterId) {
        const { id, ...rest } = dto;
        const newAssignment = await this.create(rest);
        const data = await this.find(newAssignment.id);
        return { data, message: 'Новая связь создана' };
      }

      if (!assignment.semesterId) {
        assignment.semesterId = semesterId;
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

  async getRecordForGroup (id: string){
    const assignments = await this.assignmentRepository.findAll({
      where: { courseId: id },
      attributes: ['id'],
      include: [
        {
          model: Professor,
          as: 'professor',
          include: [
            {
              model: User,
              as: 'user',
            },
          ],
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
        {
          model: Semester,
          as: 'semester',
        },
      ],
    });

    const groupsId = [...new Set(assignments.map((g) => g.group ? g.group.id : null)) as unknown as string[]].filter((el) => el !== null);

    if (!groupsId.length) {
      throw ApiException.badRequest('Запись не найдена');
    }

    const groupsData = groupsId.map((gId, indx) => {
      const acc = [];
      assignments.forEach((data) => {
        const { professor, semester, group, id } = data;
        if (data.group && data.group.id === gId) {
          // Инициализация acc[indx], если он еще не существует
          if (!acc[indx]) {
            acc[indx] = {
              id,
              group: group,
              professors: [],
              semesters: [],
            };
          }

          // Добавление professors, если они не равны null
          if (professor) {
            acc[indx].professors.push(...(Array.isArray(professor) ? professor : [professor]));
          }

          // Добавление semesters, если они не равны null
          if (semester) {
            acc[indx].semesters.push(...(Array.isArray(semester) ? semester : [semester]));
          }
        }
      });
      return acc[indx] || { groups: null, professors: [], semesters: [] }; // Возвращаем acc[indx] или объект по умолчанию
    });

    return groupsData;
  }

  async foundCoursesForProfessor (id: string) {
    const assignments = await this.assignmentRepository.findAll({
      where: { professorId: id },
      include: [
        {
          model: Course,
          as: 'course',
        },
      ],

    });

    const exists = assignments.reduce((acc, assignment) => {
      const { courseId } = assignment;
      if (!acc.some((item) => item.courseId === courseId)) {
        acc.push(assignment);
      }

      return acc;
    }, [] as Assignment[]);

    return exists.map((el) => el.course);
  }

  async foundSemestersForCourse(course_id: string) {
    const assignments = await this.assignmentRepository.findAll({
      attributes: ['semesterId'],
      where: { courseId: course_id },
      include: [
        {
          model: Semester,
          as: 'semester',
          attributes: ['id', 'name'],
        },
      ],
    });

    const exists = assignments.reduce((acc, assignment) => {
      const { semesterId } = assignment;
      if (!acc.some((item) => item.semesterId === semesterId)) {
        acc.push(assignment);
      }
      return acc;
    }, []);

    return exists
      .filter((el) => el.semester)
      .map((el) => el.semester);
  }

  async foundGroupsForCourse(courseId: string, semesterId: string) {
    const assignments = await this.assignmentRepository.findAll({
      attributes: ['groupId'],
      where: { courseId, semesterId },
      include: [
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
    });

    const exists = assignments.reduce((acc, assignment) => {
      const { semesterId } = assignment;
      if (!acc.some((item) => item.semesterId === semesterId)) {
        acc.push(assignment);
      }
      return acc;
    }, []);

    return exists.map((el) => ({
      id: el.group.id,
      name: el.group.groupCode,
    }));
  }

  //TODO delete
  async getGroupsWithSemesters(courseId: string) {
    const assignments = await Assignment.findAll({
      where: {
        courseId,
        // semesterId: { [Op.not]: null },
      },
      include: [
        {
          model: Group,
          as: 'group',
          include: [{ model: University, as: 'university', attributes: ['name'] }],
        },
        {
          model: Semester,
          as: 'semester',
          attributes: ['id', 'name', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
        },
      ],
    });

    // Группируем по groupId и убираем дубликаты семестров
    const groupsMap = new Map<string, { group: Group; semesters: Semester[] }>();

    if(!groupsMap){
      throw ApiException.badRequest('Запись не найдена');
    }

    console.log({ groupsMap });

    assignments.forEach((assignment) => {
      const groupId = assignment.groupId;
      const semester = assignment.semester;

      console.log({ groupId, semester, assignment });
      if (!groupId && !semester) {
        throw ApiException.badRequest('Запись не найдена');
      } // Пропускаем записи без группы или семестра

      if (!groupsMap.has(groupId)) {
        groupsMap.set(groupId, {
          group: assignment.group,
          semesters: [],
        });
      }

      // Проверяем, есть ли уже такой семестр в массиве
      const existingSemesters = groupsMap.get(groupId)!.semesters;

      if (!existingSemesters.length) {
        existingSemesters.push(semester);
      } else {
        console.log({ existingSemesters });
        const isDuplicate = existingSemesters?.some((s) => s.id === semester.id);

        if (!isDuplicate) {
          existingSemesters.push(semester);
        }

      }

    });

    return Array.from(groupsMap.values());
  }

  async getGroupByCourse (courseId: string, params: {semesterId: string} ) {
    const assignment = await this.assignmentRepository.findAll({
      where: { courseId: courseId, ...params },
      include: [
        {
          model: Group,
          as: 'group',
          required: true,
          include: [
            {
              model: University,
              as: 'university',
              attributes: ['name'],
            },
          ],
        },
      ],
    });
    if(!assignment){
      throw ApiException.badRequest('Запись не найдена');
    }

    const uniqueGroups = assignment
      .map((el) => el.group)
      .reduce((acc, group) => {
        if (!acc.find((g) => g.id === group.id)) {
          acc.push({ id: group.id, label: group.groupCode });
        }
        return acc;
      }, []);
    return uniqueGroups;
  }

  async getSemesterByCourse (courseId: string, params: {groupId: string}) {
    const assignment = await this.assignmentRepository.findAll({
      where: { courseId: courseId, ...params },
      include: [
        {
          model: Semester,
          as: 'semester',
          required: true,
        },
      ],
    });

    const uniqueSemesters = assignment
      .map((el) => el.semester)
      .reduce((acc, semester) => {
        if (!acc.find((s) => s.id === semester.id)) {
          acc.push({ id: semester.id, label: semester.name });
        }
        return acc;
      }, []);
    return uniqueSemesters;
  }
}