import { Module } from '@nestjs/common'
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { models } from '../../DB/modelGenerations';
import { DBMethods } from '../../DB/DBMethods';
import {JwtService} from '@nestjs/jwt'
import { SendEmailService } from '../../services/sendEmailService';

@Module({
    imports: [models],
    controllers: [UserController],
    providers: [UserService , DBMethods , JwtService, SendEmailService]
})
export class UserModule { }