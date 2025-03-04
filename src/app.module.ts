import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AssigmentCourseModule } from './modules/assigment_course/assigment_course.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoursesModule } from './modules/courses/courses.module';
import { DatabaseModule } from './modules/database/database.module';
import { GroupModule } from './modules/groups/groups.module';
import { ProfessorsModule } from './modules/professors/professors.module';
import { SemesterGroupModule } from './modules/semester-group/semester-group.module';
import { SemesterGroupCourseModule } from './modules/semester-group-course/semester-group-course.module';
import { SemestersModule } from './modules/semesters/semesters.module';
import { StudentsModule } from './modules/students/students.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { UniversitiesModule } from './modules/universities/universities.module';
import { UsersModule } from './modules/users/users.module';

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
    SemestersModule,
    SemesterGroupModule,
    SemesterGroupCourseModule,
    TasksModule,
    AuthModule,
    AssigmentCourseModule,
  ],
})
export class AppModule {}
