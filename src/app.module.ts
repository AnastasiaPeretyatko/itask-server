import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './modules/database/database.module';
import { ProfessorsModule } from './modules/professors/professors.module';
import { UniversitiesModule } from './modules/universities/universities.module';
import { GroupModule } from './modules/groups/groups.module';
import { StudentsModule } from './modules/students/students.module';
import { CoursesModule } from './modules/courses/courses.module';
import { Semester } from './models/semestr.model';
import { SemestersModule } from './modules/semestrs/semestrs.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    UsersModule,
    ProfessorsModule,
    UniversitiesModule,
    GroupModule,
    StudentsModule,
    CoursesModule,
    SemestersModule
  ],
})
export class AppModule {}
