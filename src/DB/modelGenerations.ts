import { MongooseModule } from '@nestjs/mongoose'
import { User, userSchema } from './schemas/user.schema'


export const models = MongooseModule.forFeature([
    { name: User.name, schema: userSchema }
])
