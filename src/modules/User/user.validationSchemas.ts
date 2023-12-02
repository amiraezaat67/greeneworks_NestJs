

import { z } from 'zod'

//========================= sign up schema =========================//
/**
 * username: string, minimum 3 characters, maximum 10 characters
 * email: string, must be a valid email
 * password: string, minimum 8 characters, must contain at least one uppercase letter, one lowercase letter, one number and one special character
 * cPassword: string, must match password
 */
export const signUpScehma = z
    .object({
        username: z.string().min(3).max(10),
        email: z.string().email({ message: "Please enter a valid email address." }),
        password: z
        .string()
        .regex(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, 
            { message: "Your password must contain at least one uppercase letter, one lowercase letter, one number and one special character." }),
        cPassword: z.string(),
        role: z.enum(['User', 'Admin']).optional(),
    })
    .partial()
    .superRefine((val, ctx) => {
            if (val.password !== val.cPassword) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Your password must match the confirmation password.',
                    path: ['cPassword']
                })
            }
    })

export const signInScehma = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
    .string()
    .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
    { message: "Your password must contain at least one uppercase letter, one lowercase letter, one number and one special character." })
}).required()
