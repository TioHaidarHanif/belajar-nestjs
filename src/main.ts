import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // We intentionally do not register middleware/interceptors/pipes/filters globally
  // — they are applied only to the `article` feature in this example.
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
