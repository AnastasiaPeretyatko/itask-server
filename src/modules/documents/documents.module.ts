import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Document } from 'src/models/documents.model';
import { SocketModule } from 'src/socket/socket.module';

import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';

import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService],
  imports: [SequelizeModule.forFeature([Document]), AuthModule, SocketModule],
})
export class DocumentsModule {}
