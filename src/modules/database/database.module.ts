import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from 'src/models/group.model';
import { Professor } from 'src/models/professor.model';
import { University } from 'src/models/university.model';
import { User } from 'src/models/user.model';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get<number>('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USERNAME'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        models: [User, Professor, Group, University],
        autoLoadModels: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [DatabaseModule],
})
export class DatabaseModule {}
