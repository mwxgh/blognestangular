import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

declare const module: any;

async function bootstrap() {
  const adapter = new FastifyAdapter({ bodyLimit: 2560000000 }); //256m
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  adapter.register(require('fastify-multipart'));
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter
  );
  app.enableCors();
  const appName = 'MWX';
  const appVersion = '1.0';
  const builder = new DocumentBuilder()
    .setTitle(appName)
    .addBearerAuth()
    .setVersion(appVersion);
  if (environment.appUrl) {
    builder.addServer(environment.appUrl);
  }
  const options = builder.build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets({
    root: join(__dirname, 'public'),
    prefix: '/public/',
  });
  const port = process.env.PORT || 3333;
  await app.listen(port, '0.0.0.0');

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
