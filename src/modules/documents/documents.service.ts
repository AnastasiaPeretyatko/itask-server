import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Document } from 'src/models/documents.model';
import { User } from 'src/models/user.model';

import { ApiException } from 'src/common/exceptions/api.exceptions';

@Injectable()
export class DocumentsService {
  constructor(@InjectModel(Document) private documentRepository: typeof Document) {}

  async create(dto: Partial<Document>) {
    const document = await this.documentRepository.create(dto);
    return { data: document, message: 'Документ успешно создан' };
  }

  async update(id: string, dto: Partial<Document>) {
    const isExists = await this.find(id);
    if (!isExists) {
      throw new Error('Document not found');
    }
    await this.documentRepository.update(dto, { where: { id } });
    return { data: await this.find(id), message: 'Документ успешно обновлен' };
  }

  async find(id: string) {
    const document = await this.documentRepository.findByPk(id, {
      include: [
        { model: Document, as: 'children' },
        { model: Document, as: 'parent' },
        { model: User, as: 'creator' },
      ],
    });
    return document;
  }

  async findAll(author_id: string) {
    const documents = await this.documentRepository.findAll({
      where: { creatorId: author_id },
      order: [['updatedAt', 'DESC']],
    });
    return documents;
  }

  async delete(id: string) {
    const isExists = await this.find(id);
    if (!isExists) {
      throw new Error('Document not found');
    }

    const document = await this.find(id);
    if (!document) {
      throw ApiException.badRequest('Документ не найден');
    }
    //TODO добавить проверку если удален родитель то удалить дочерние документы
    await document.destroy();
    return { message: 'Документ успешно удален' };
  }
}
