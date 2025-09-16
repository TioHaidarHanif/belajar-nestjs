
import { Controller, Get, Post, Put, Delete, Param, Body, Req, UseGuards, UseInterceptors, UseFilters } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import httpClient from '../common/http/http-client';

@Controller('articles')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@UseFilters(HttpExceptionFilter)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(): Promise<Article[]> {
    const articles = await this.articleService.findAll();
    return articles.map(article => {
      if (article.user && 'password' in article.user) {
        const { password, ...userSafe } = article.user;
        article.user = userSafe as any;
      }
      return article;
    });
  }

  // Demo: call an external service and propagate X-Request-Id automatically
  @Get('proxy')
  async proxy(@Req() req: Request) {
    // Call a local echo endpoint to demonstrate propagation without external network
    const base = `${req.protocol}://${req.get('host')}`;
    try {
      const resp = await httpClient.get(`${base}/articles/headers-echo`);
      return { proxiedStatus: resp.status, remoteHeaders: resp.data };
    } catch (err: any) {
      // return error details to help debugging in this dev environment
      return { error: true, message: err.message, stack: err.stack };
    }
  }

  // Local endpoint that echoes request headers so we can verify X-Request-Id propagation
  @Get('headers-echo')
  headersEcho(@Req() req: Request) {
    return { headers: req.headers };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Article | null> {
    const parsedId = typeof id === 'string' ? parseInt(id as any, 10) : id;
    const article = await this.articleService.findOne(parsedId as number);
    if (article && article.user && 'password' in article.user) {
      const { password, ...userSafe } = article.user;
      article.user = userSafe as any;
    }
    return article;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() body: { title: string; content: string }, @Req() req: Request): Promise<Article> {
    // @ts-ignore
    return this.articleService.create(body.title, body.content, req.user).then(article => {
      if (article.user && 'password' in article.user) {
        const { password, ...userSafe } = article.user;
        article.user = userSafe as any;
      }
      return article;
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<Article>,
    @Req() req: Request,
  ): Promise<Article | null> {
    const parsedId = typeof id === 'string' ? parseInt(id as any, 10) : id;
    // @ts-ignore
    const article = await this.articleService.update(parsedId as number, body, req.user);
    if (article && article.user && 'password' in article.user) {
      const { password, ...userSafe } = article.user;
      article.user = userSafe as any;
    }
    return article;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request): Promise<{ success: boolean }> {
    const parsedId = typeof id === 'string' ? parseInt(id as any, 10) : id;
    // @ts-ignore
    const success = await this.articleService.remove(parsedId as number, req.user);
    return { success };
  }
}
