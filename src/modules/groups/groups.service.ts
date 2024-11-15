import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ApiException } from 'src/common/exceptions/api.exceptions';
import { Group } from 'src/models/group.model';
import { CreateGroupDto } from './dto/create-group.dto';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { University } from 'src/models/university.model';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GetAllGroup } from './dto/get-groups.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group) private groupRepository: typeof Group,
    @InjectModel(University) private universityRepository: typeof University,
  ) {}

  async getOne(id: string) {
    const group = await this.groupRepository.findOne({
      attributes: { exclude: ['university_id'] },
      where: { id },
      include: [
        {
          model: University,
          as: 'university',
        },
      ],
      raw: false, // Keep nested object structure for included models
      nest: true, // Allows nesting of include models in plain objects
    });

    // Удаляем ключ university из объекта group
    const plainGroup = group.get({ plain: true });
    delete plainGroup.university; // Удаляем ключ

    return plainGroup;
  }

  async create(dto: CreateGroupDto) {
    const university = await this.universityRepository.findByPk(
      dto.universityId,
    );

    if (!university) throw ApiException.badRequest('Университет не найден');

    const group = await this.groupRepository.create({
      universityId: dto.universityId,
      degree: dto.degree,
      educationMode: dto.educationMode,
      course: dto.course,
      groupNumber: dto.groupNumber,
    });

    return this.getOne(group.id);
  }

  async update(id: string, dto: UpdateGroupDto) {
    const group = await this.groupRepository.findByPk(id);

    if (!group) throw ApiException.badRequest('Группа не найдена');

    group.update(dto);
    group.save();

    return this.getOne(id);
  }

  async getAll(query: GetAllGroup) {
    const { search } = query;

    const groups = await this.groupRepository.findAll({
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

    return filteredGroups;
  }
}
