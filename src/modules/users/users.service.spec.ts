import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from 'src/models/user.model';
import uuid from 'uuid';

import { ROLE } from 'src/common/enum/role';

import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  const mockUserRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(user =>
      Promise.resolve({
        ...user,
        id: uuid.v4(),
      }),
    ),
    findOne: jest.fn().mockImplementation(dto => dto),
    hashPassword: jest.fn().mockImplementation(password => password),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user record and return that', async () => {
    const dto = { email: 'user111@user.com', role: ROLE.STUDENT };

    // findOne вернёт null → пользователя ещё нет
    mockUserRepository.findOne.mockResolvedValue(null);

    // hashPassword пусть возвращает "hashedPass"
    mockUserRepository.hashPassword.mockResolvedValue('hashedPass');

    // create вернёт нового пользователя
    mockUserRepository.create.mockResolvedValue({
      id: 'uuid-123',
      email: dto.email,
      role: dto.role,
      dataValues: { id: 'uuid-123', email: dto.email, role: dto.role },
    });

    const result = await service.create(dto.email, dto.role);

    expect(result).toEqual({
      id: 'uuid-123',
      email: dto.email,
      role: dto.role,
      dataValues: { id: 'uuid-123', email: dto.email, role: dto.role },
    });

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: dto.email } });
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      email: dto.email,
      role: dto.role,
      password: 'hashedPass',
    });
  });

  it('should throw an error if user already exists', async () => {
    const dto = { email: 'user@user.com', role: ROLE.STUDENT };
    mockUserRepository.findOne.mockResolvedValue({ id: 'uuid-123', ...dto });

    await expect(service.create(dto.email, dto.role)).rejects.toThrowError(
      `Пользователь с почтовым адресом ${dto.email} уже существует`,
    );
  });
});
