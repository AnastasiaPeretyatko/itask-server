import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { PaginationDto } from 'src/common/validation/pagination';
import { Assignment } from 'src/models/assignment.model';
import { Group } from 'src/models/group.model';
import { Student } from 'src/models/student.model';
import { University } from 'src/models/university.model';
import { User } from 'src/models/user.model';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group) private groupRepository: typeof Group,
    @InjectModel(University) private universityRepository: typeof University,
    @InjectModel(Student) private studentsRepository: typeof Student,
    @InjectModel(Assignment) private assignmentRepository: typeof Assignment,
  ) { }

  async getOne(id: string) {
    const group = await this.groupRepository.findOne({
      where: { id },
      include: [
        {
          model: University,
          as: 'university',
        },
      ],
    });

    const plainGroup = group.get({ plain: true });
    return plainGroup;
  }

  async create(dto: GroupDto) {
    const university = await this.universityRepository.findByPk(
      dto.universityId,
    );

    if (!university) {throw ApiException.badRequest('Университет не найден');}

    const group = await this.groupRepository.create({
      universityId: dto.universityId,
      degree: dto.degree,
      educationMode: dto.educationMode,
      course: dto.course,
      groupNumber: dto.groupNumber,
    });

    return {
      data: await this.getOne(group.id),
      message: 'Группа успешно создана',
    };
  }

  async update(id: string, dto: UpdateGroupDto) {
    const group = await this.groupRepository.findByPk(id);

    if (!group) {throw ApiException.badRequest('Группа не найдена');}

    group.update(dto);
    group.save();

    return {
      data: await this.getOne(id),
      message: 'Группа успешно обновлена',
    };
  }

  async getAll(query: PaginationDto) {
    const { search } = query;

    const { rows: groups, count } = await this.groupRepository.findAndCountAll({
      include: [
        {
          model: University,
          as: 'university',
        },
      ],
    });

    const filteredGroups = search
      ? groups.filter((group) =>
        group.groupCode.toLowerCase().includes(search.toLowerCase()),
      )
      : groups;

    return { data: filteredGroups, count };
  }

  async getGroupNameAndId(search: string) {
    const groups = await this.groupRepository.findAll({
      where: { isActive: true },
      include: [
        {
          model: University,
          as: 'university',
        },
      ],
    });

    const filteredGroups = search
      ? groups.filter((group) => group.groupCode.toLowerCase().includes(search.toLowerCase()))
      : groups;

    const result = filteredGroups.map((group) => ({
      id: group.id,
      name: group.groupCode,
    }));

    return result;
  }

  async getAllGroupId() {
    const groups = await this.groupRepository.findAll({
      include: [
        {
          model: University,
          as: 'university',
        },
      ],
    });
    return groups.map((el) => ({ id: el.id }));
  }

  async getStudentsByGroup(id: string) {
    const group = await this.getOne(id);

    if (!group) {throw ApiException.notFound('Группа не найдена');}

    const students = await this.studentsRepository.findAll({
      where: { group_id: id },
      include: [
        { model: Group, as: 'group', include: [{ model: University, as: 'university' }] },
        { model: User, as: 'user' },
      ],
    });
    return students;
  }

  async getCoursesByGroup (id: string) {
    const groups = await this.assignmentRepository.findAll({
      where: { courseId: id },
      include: [
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
      ],
    });

    const exists = groups.reduce((acc, assignment) => {
      const { groupId } = assignment;
      if (!acc.some((item) => item.groupId === groupId)) {
        acc.push(assignment);
      }

      return acc;
    }, [] as Assignment[]);

    return exists.map((el) => ({ id: el.groupId, name: el.group.groupCode }));
  }
}
