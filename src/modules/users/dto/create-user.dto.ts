import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

import { ROLE } from 'src/common/enum/role';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@user.ru',
    description: 'Email пользователя',
  })
  @IsEmail({}, { message: 'Некорректный email' })
  @IsNotEmpty({ message: 'Email обязателен' })
  readonly email: string;

  @ApiProperty({
    example: ROLE.STUDENT,
    description: 'Роль пользователя',
  })
  @IsEnum(ROLE, { message: 'Некорректная роль' })
  @IsNotEmpty({ message: 'Роль обязательна' })
  readonly role: ROLE;
}
