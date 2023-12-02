import { Controller, Get, Body, Res, Post, Req, Delete, Put } from '@nestjs/common'
import { UserService } from './user.service'
import { Response, Request } from 'express'
import { AuthGuard } from '../../Guards/auth.guard';
import { signInBodyDto, signupBodyDto } from './user.dto';
import { ZodValidationPipe } from '../../pipes/validation.pipe';
import { UsePipes } from '@nestjs/common/decorators/core/use-pipes.decorator';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import * as validators from './user.validationSchemas';

@Controller({ path: '/api/users' })
export class UserController {
    constructor(private readonly _authService: UserService) { }

    @Post('signup')
    @UsePipes(new ZodValidationPipe(validators.signUpScehma))
    signUpHandler(
        @Body() body: signupBodyDto,
        @Res() res: Response
    ) {
        return this._authService.SignUpService(body, res)
    }
  
    @Get('confirmEmail/:token')
    confirmEmailHandler(
        @Req() req: Request,
        @Res() res: Response
    ) {
        return this._authService.confirmEmailService(req, res)
    }
  
    @Post('login')
    @UsePipes(new ZodValidationPipe(validators.signInScehma))
    logInHandler(
        @Body() body: signInBodyDto,
        @Res() res: Response
    ) {
        return this._authService.LogInService(body, res)
    }


    @Put('updateAccount')
    @UseGuards(AuthGuard)
    updateAccountHandler(
        @Req() req: Request,
        @Res() res: Response
    ) {
        return this._authService.updateAccountService(req, res)
    }

    @Delete('deleteAccount')
    @UseGuards(AuthGuard)
    deleteAccountHandler(
        @Req() req: Request,
        @Res() res: Response
    ) {
        return this._authService.deleteAccountService(req, res)
    }


    @Get('profile')
    @UseGuards(AuthGuard)
    GetUserProfileHandler(
        @Req() req: Request,
        @Res() res: Response
    ) {
        return this._authService.getUserProfileService(req, res)
    }
}