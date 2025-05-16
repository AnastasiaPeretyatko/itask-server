import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AssigmentModule } from './modules/assigment/assigment.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoursesModule } from './modules/courses/courses.module';
import { DatabaseModule } from './modules/database/database.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { GroupModule } from './modules/groups/groups.module';
import { MessageModule } from './modules/message/message.module';
import { ProfessorsModule } from './modules/professors/professors.module';
import { RoomModule } from './modules/room/room.module';
import { SemestersModule } from './modules/semesters/semesters.module';
import { StudentsModule } from './modules/students/students.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { UniversitiesModule } from './modules/universities/universities.module';
import { UserTaskModule } from './modules/user_task/user_task.module';
import { UsersModule } from './modules/users/users.module';
import { SocketModule } from './socket/socket.module';

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
    TasksModule,
    AuthModule,
    AssigmentModule,
    UserTaskModule,
    SocketModule,
    MessageModule,
    RoomModule,
    DocumentsModule,
  ],
})
export class AppModule {}
