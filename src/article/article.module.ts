import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import LoggerMiddleware from '../common/middleware/logger.middleware';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ApiKeyService } from '../common/guards/api-key.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  providers: [ArticleService, LoggingInterceptor, TransformInterceptor, HttpExceptionFilter, ApiKeyService],
  controllers: [ArticleController],
})
export class ArticleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply logger middleware only to article routes
    consumer.apply(LoggerMiddleware).forRoutes(ArticleController);
  }
}
