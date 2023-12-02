
import { Injectable } from '@nestjs/common'



@Injectable()
export class DBMethods {
    constructor() { }

    async createDocument(model: any, data: object): Promise<object> {
        const document = await model.create(data)
        return document
    }

    async saveDocument(model: any, data: object): Promise<object> {
        const newDoc = new model(data)
        const document = await newDoc.save()
        return document
    }

    async findOneDocument(model: any, condition: object): Promise<object> {
        const document = await model.findOne(condition)
        return document
    }

    async updateDocument(model: any, condition: object , data:object): Promise<object> {
        const document = await model.findOneAndUpdate(condition,data)
        return document
    }

    async deleteDocument(model: any, condition: object): Promise<object> {
        const document = await model.findByIdAndDelete(condition)
        return document
    }
}