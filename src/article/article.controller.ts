
import { Controller, Get, Post, Put, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('articles')
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

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Article | null> {
    const article = await this.articleService.findOne(Number(id));
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
    @Param('id') id: string,
    @Body() body: Partial<Article>,
    @Req() req: Request,
  ): Promise<Article | null> {
    // @ts-ignore
    const article = await this.articleService.update(Number(id), body, req.user);
    if (article && article.user && 'password' in article.user) {
      const { password, ...userSafe } = article.user;
      article.user = userSafe as any;
    }
    return article;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request): Promise<{ success: boolean }> {
    // @ts-ignore
    const success = await this.articleService.remove(Number(id), req.user);
    return { success };
  }
}
