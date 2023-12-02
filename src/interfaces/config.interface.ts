

export interface ConfigProps {
    port: number | undefined
    accessTokenSginature: string | undefined
    saltRounds: number | undefined
    mongodb: {
        database:{
            connectionString: string | undefined
        }
    },
    sendEmail:{
        EMAIL_SENDER_ACCOUNT:string | undefined,
        EMAIL_SENDER_PASSWORD: string | undefined,
    },
    confirmationTokenSignature:string | undefined,
    locals:{
        protocol: string | undefined,
        host: string | undefined
    }
}