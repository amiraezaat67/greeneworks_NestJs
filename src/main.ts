import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from "@nestjs/common"
import { AppModule } from './app.module';
// import { HttpExceptionFilter } from './filters/errorHandling.filter';

async function bootstrap() {
  const port = process.env.PORT;
  const app = await NestFactory.create(AppModule); 
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))
  // we can use it as a global filter or global response interceptor,but it ignored for now because i apply a try catch block in every controller 
  // app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(port || 5000, () => {
    console.log(`server is running on ${port}`);
  });
} 
bootstrap();
