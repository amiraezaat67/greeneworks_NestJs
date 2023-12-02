

import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../DB/schemas/user.schema';
import { DBMethods } from '../DB/DBMethods';
import { Model } from 'mongoose';
import { env } from 'process';



/* as we need to return the request object (not only boolean ), 
  we need to use the promise<object> instead of boolean
  so you need to updare the canActivate method to return the request object
*/
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private _JwtService: JwtService,
        @InjectModel(User.name) private _userModel: Model<User>,
        private _dbMethod: DBMethods) { } 
     async canActivate(
        context: ExecutionContext,
    ): Promise<object> {
        const request = context.switchToHttp().getRequest();
        const { authorization } = request.headers
        if (!authorization) {
            throw new BadRequestException('pleaee lognIn first')
        }
        if (!authorization.startsWith('greeneworks__')) {
            throw new BadRequestException('wrong prefix')
        }
        const token = authorization.split('__')[1]
        const decodedData = this._JwtService.verify(token, { secret: env.ACCESS_TOKN_SIGNATURE })
        if (!decodedData._id) {
            throw new BadRequestException('wrong token')
        }
        const user = await this._dbMethod.findOneDocument(this._userModel, { _id: decodedData._id })
        if (!user) {
            throw new BadRequestException('please signup first')

        }
        request['authUser'] = user
        return request
    }
}