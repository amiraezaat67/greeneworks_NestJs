import { IsString, MinLength, MaxLength, IsNumber, IsEnum, IsNotEmpty, IsOptional, IsEmail } from "class-validator";


// ======================= SignUp DTO =======================//
export class signupBodyDto {

    @IsString()
    @MinLength(3, {
        message: 'your username must be at least 3 chars'
    })
    @MaxLength(10, {
        message: 'your username must not exceed 10 chars'
    })
    username: string


    @IsString()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    
    @IsString()
    @IsNotEmpty()
    cPassword: string

    @IsString()
    @IsEnum(['User', 'Admin'])
    @IsOptional()
    role: string
}

// ======================= SignIn DTO =======================//
export class signInBodyDto {

    @IsString()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}


// ======================= update DTO =======================//
export class updateBodyDto {

    @IsString()
    @IsEmail()
    email: string

    @IsString()
    @MinLength(3, {
        message: 'your username must be at least 3 chars'
    })
    @MaxLength(10, {
        message: 'your username must not exceed 10 chars'
    })
    username: string
}