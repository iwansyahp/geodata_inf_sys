import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { SWAGGER_ENDPOINT } from './common/constants/common.constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // use helmet
  app.use(helmet());

  // setup swagger
  const config = new DocumentBuilder()
    .setTitle('GeoData API')
    .setDescription('GeoData API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_ENDPOINT, app, document);

  // start server
  await app.listen(3000);
}
bootstrap();
