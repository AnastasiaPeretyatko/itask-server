import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';

@Injectable()
export class AuthService {
  constructor(){
    // @InjectModel(User) private userRepository: typeof
  }
}
