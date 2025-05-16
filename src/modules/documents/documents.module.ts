import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Document } from 'src/models/documents.model';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService],
  imports:[
    SequelizeModule.forFeature([Document]),
    AuthModule,
    SocketModule,
  ],
})
export class DocumentsModule {}
