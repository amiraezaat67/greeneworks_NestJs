import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/User/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
   MongooseModule.forRoot(process.env.CONNECTION_URL_LOCAL), 
   UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
