

import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from '../../DB/schemas/user.schema'
import { DBMethods } from '../../DB/DBMethods'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { SendEmailService } from '../../services/sendEmailService';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private _userModel: Model<User>,
        private _dbMethod: DBMethods,
        private _JwtService: JwtService,
        private _sendEmailService: SendEmailService
    ) { }

    //========================= SignUpService =========================//
    /**
     * SignUpService is a service method which is used to add new user
     * destructuring the required data from the body 
     * check if user is already exists or not
     * if user is already exists then throw an error
     * if user is not exists then hash the password and add the user
     * add the user and return the response
     */
    async SignUpService(body: any, res: any): Promise<object> {
        try {
            const { username, email, password, role } = body
            //1-check if user is already exists or not
            const userExists = await this._dbMethod.findOneDocument(this._userModel, { email })
            // 2- id user not esists then throw an error
            if (userExists) {
                throw new BadRequestException('email is already exists')
            }
            const confirmationToken = this._JwtService.sign({ email }, { secret: process.env.CONFIRMATION_TOKEN_SIGNATURE })
            const confirmationLink = `${process.env.LOCAL_PROTOCOL}${process.env.LOCAL_HOST}/api/users/confirmEmail/${confirmationToken}`
            console.log(confirmationLink);

            this._sendEmailService.sendEmail(
                email,
                'Welcome to our website',
                `<h1>please confirm your email by clicking on the link below</h1>
                <a href="${confirmationLink}">confirm email</a>
                `
            )
            //2- if user is exists , hash the password and add the user
            const hasedPass = bcrypt.hashSync(password as string, +process.env.SALT_ROUNDS)
            const userObject = { username, email, password: hasedPass, role }
            //3-add the user and return the response
            const savedUser = await this._dbMethod.createDocument(this._userModel, userObject)
            if (!savedUser) {
                throw new BadRequestException('fail to add user')
            }
            return res.status(201).json({ message: 'Your registration is completed success please try to login', savedUser })
        } catch (error) {
            console.log(`error happend in signup service. Details:${error}`);
            throw new InternalServerErrorException({
                message: 'Uknown error happend in signup service',
                error_message: error.message,
                status: 500
            })
        }
    }

    // =============================== Confirm Email API ===============================//
    /**
     * desturct token from the request params
     * verify the token
     * update user document to be confirmed
     * send response
     */
    async confirmEmailService(req: any, res: any): Promise<object> {
        try {
            const { token: confirmationToken } = req.params
            const { email } = this._JwtService.verify(confirmationToken, { secret: process.env.CONFIRMATION_TOKEN_SIGNATURE })
            const user = await this._dbMethod.updateDocument(this._userModel, { email }, { isConfirmed: true })
            if (!user) {
                throw new BadRequestException('fail to confirm email')
            }
            return res.status(200).json({ message: 'Your email is confirmed successfully, please try to' })
        } catch (error) {
            console.log(`error happend in confirm email service. Details:${error}`);
            throw new InternalServerErrorException({
                message: 'Uknown error happend in confirm email service',
                error_message: error.message,
                status: 500
            })
        }
    }


    //========================= SignInService =========================//
    /**
     * SignInService is a service method which is used to login user
     * destructuring the required data from the body
     * check if user is exists or not
     * if user is not exists then throw an error
     * if user is exists then compare the password
     * if password is not match then throw an error
     * if password is match then generate the token and return the response
     */
    async LogInService(body: any, res: any): Promise<object> {
        try {
            const { email, password } = body
            // 1- check if user is exists or not
            const userExists = await this._dbMethod.findOneDocument(this._userModel, { email })
            if (!userExists) {
                // throw new BadRequestException('in-valid login credential')
                return res.status(400).json({ message: 'in-valid login credential' })
            }
            // 2- if user is exists then compare the password
            const isPasswordMatch = bcrypt.compareSync(password, userExists['password'])
            if (!isPasswordMatch) {
                return res.status(400).json({ message: 'in-valid login credential' })
            }
            // 3- if password is match then generate the token and return the response
            const token = this._JwtService.sign({
                email: userExists['email'],
                _id: userExists['_id']
            }, {
                secret: process.env.ACCESS_TOKN_SIGNATURE
            })

            return res.status(200).json({ message: 'SignIn Success', token })
        } catch (error) {
            console.log(`error happend in login service. Details:${error}`);
            throw new InternalServerErrorException({
                message: 'Uknown error happend in login service',
                error_message: error.message,
                status: 500
            })
        }

    }

    //========================= updateAccountService =========================//
    /**
     * desturct data from the request body
     * if the user update the email we need to check if the new email is already registered before or not
     * if not registered before send confirmation email to the new email
     * if registered before return error
     * if the user update the username 
     * update the loggedIn user with the updatedObject
     * return response after update
    */
    async updateAccountService(req: any, res: any): Promise<object> {
        try {
            const { _id } = req.authUser
            const { username, email } = req.body
            let updatedObject = {}

            // 1- set the updatedObject with the new username
            if (username) {
                updatedObject['username'] = username
            }
            //2- if the user update the email we need to check if the new email is already registered before or not
            if (email) {

                // 1- we need to check if the new email is already registered before or not
                const userExists = await this._dbMethod.findOneDocument(this._userModel, { email })
                // 2- id user not esists then throw an error
                if (userExists) {
                    throw new BadRequestException('email is already exists')
                }
                // 3- if not registered before send confirmation email to the new email
                const confirmationToken = this._JwtService.sign({ email }, { secret: process.env.CONFIRMATION_TOKEN_SIGNATURE })
                const confirmationLink = `${process.env.LOCAL_PROTOCOL}${process.env.LOCAL_HOST}/api/users/confirmEmail/${confirmationToken}`

                this._sendEmailService.sendEmail(
                    email,
                    'Welcome to our website',
                    `<h1>please confirm your email by clicking on the link below</h1>
                <a href="${confirmationLink}">confirm email</a>
                `
                )
                // 5- set the updatedObject with the new email
                updatedObject['email'] = email
                updatedObject['isConfirmed'] = false
            }
            // 3- update the loggedIn user with the updatedObject
            const user = await this._dbMethod.updateDocument(this._userModel, { _id }, updatedObject)
            // 4- return the error if the user doeas not exists to be updated
            if (!user) throw new BadRequestException('Your account is not updated please try to login again')
            // 5- return the response if the user is updated
            return res.status(200).json({ message: 'Your account is updated Successfully' })
        } catch (error) {
            console.log(`error happend in update account service. Details:${error}`);
            throw new InternalServerErrorException({
                message: 'Uknown error happend in update account service',
                error_message: error.message,
                status: 500
            })
        }
    }

    //========================= deleteAccountService =========================//
    /**
     * deleteAccountService is a service method which is used to delete user account
     * destructuring the id from the authUser (loggedIn user data)
     * if user is not exists to be deleted then throw an error
     * if user is exists then delete the user and return the response
     */
    async deleteAccountService(req: any, res: any): Promise<object> {
        try {
            const { _id } = req.authUser
            //1-delete the account of the loggedIn user 
            const user = await this._dbMethod.deleteDocument(this._userModel, { _id })
            // 2- return the error if the user doeas not exists to be deleted
            if (!user) throw new BadRequestException('Your account is not delete please try to login again')
            // 3- return the response if the user is deleted
            return res.status(200).json({ message: 'Your account is deleted Successfully' })
        } catch (error) {
            console.log(`error happend in delete account service. Details:${error}`);
            throw new InternalServerErrorException({
                message: 'Uknown error happend in delete account service',
                error_message: error.message,
                status: 500
            })
        }
    }

    //========================= GetUserProfileService =========================//  
    /**
     * GetUserProfileService is a service method which is used to get user profile
     * destructuring the id from the authUser (loggedIn user data)
     * if user is not exists then throw an error
     * if user is exists then return the response
     */
    async getUserProfileService (req: any, res: any): Promise<object> {
        try {
            const { _id } = req.authUser
            const user = await this._dbMethod.findOneDocument(this._userModel, { _id })
            if (!user) throw new BadRequestException('Your account is not found please try to signUp or login again')
            return res.status(200).json({ message: 'Your account is found Successfully', user })
        } catch (error) {
            console.log(`error happend in get user profile service. Details:${error}`);
            throw new InternalServerErrorException({
                message: 'Uknown error happend in get user profile service',
                error_message: error.message,
                status: 500
            })
        }
    }

}