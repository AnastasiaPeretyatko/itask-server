import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './modules/database/database.module';
import { ProfessorsModule } from './modules/professors/professors.module';
import { GroupModule } from './modules/groups/groups.module';
import { StudentsModule } from './modules/students/students.module';

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
    // GroupModule,
    // StudentsModule
  ],
})
export class AppModule {}
