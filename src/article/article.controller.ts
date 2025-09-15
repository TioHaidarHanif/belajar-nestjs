
import { Controller, Get, Post, Put, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  findAll(): Promise<Article[]> {
    return this.articleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Article | null> {
    return this.articleService.findOne(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() body: { title: string; content: string }, @Req() req: Request): Promise<Article> {
    // @ts-ignore
    return this.articleService.create(body.title, body.content, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<Article>,
    @Req() req: Request,
  ): Promise<Article | null> {
    // @ts-ignore
    return this.articleService.update(Number(id), body, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request): Promise<{ success: boolean }> {
    // @ts-ignore
    const success = await this.articleService.remove(Number(id), req.user);
    return { success };
  }
}
