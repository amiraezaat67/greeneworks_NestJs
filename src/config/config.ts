import { ConfigProps } from "src/interfaces/config.interface";

export const config = ():ConfigProps => ({
    port: process.env.PORT,
    accessTokenSginature: process.env.ACCESS_TOKN_SIGNATURE,
    saltRounds: parseInt(process.env.SALT_ROUNDS, 10) || 8 , 
    mongodb: {
        database: {
            connectionString: process.env.CONNECTION_URL_LOCAL
        }
    },
    sendEmail:{
        EMAIL_SENDER_ACCOUNT:process.env.EMAIL_SENDER_ACCOUNT,
        EMAIL_SENDER_PASSWORD: process.env.EMAIL_SENDER_PASSWORD,
    },
    confirmationTokenSignature: process.env.CONFIRMATION_EMAIL_TOKEN,
    locals:{
        protocol: process.env.LOCAL_PROTOCOL,
        host:process.env.LOCAL_HOST
    }
});