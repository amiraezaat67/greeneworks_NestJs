

import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose'

@Schema({timestamps: true})
export class User{
    @Prop({
        type: String,
        required: true
    })
    username: string
    
    @Prop({
        type: String,
        required: true
    })
    email: string

    @Prop({
        type: String,
        required: true
    })
    password: string

    @Prop({
        type: String,
        default: 'User',
        enum: ['User', 'Admin']
    })
    role: string
    
    @Prop({
        type: Boolean,
        default: false
    })
    isConfirmed: boolean
}

export const userSchema = SchemaFactory.createForClass(User)