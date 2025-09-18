
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
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Articles')
@Controller('articles')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@UseFilters(HttpExceptionFilter)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of articles retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          title: { type: 'string', example: 'Introduction to NestJS' },
          content: { type: 'string', example: 'NestJS is a framework...' },
          createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              username: { type: 'string', example: 'john_doe' },
              email: { type: 'string', example: 'john@example.com' }
            }
          }
        }
      }
    }
  })
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
  @ApiOperation({ summary: 'Proxy request to demonstrate header propagation' })
  @ApiResponse({ 
    status: 200, 
    description: 'Proxy response with header propagation',
    schema: {
      type: 'object',
      properties: {
        proxiedStatus: { type: 'number', example: 200 },
        remoteHeaders: { type: 'object' }
      }
    }
  })
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
  @ApiOperation({ summary: 'Echo request headers for testing' })
  @ApiResponse({ 
    status: 200, 
    description: 'Request headers echoed back',
    schema: {
      type: 'object',
      properties: {
        headers: { type: 'object' }
      }
    }
  })
  @Get('headers-echo')
  headersEcho(@Req() req: Request) {
    return { headers: req.headers };
  }

  @ApiOperation({ summary: 'Get a specific article by ID' })
  @ApiParam({ name: 'id', description: 'Article ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Article retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        title: { type: 'string', example: 'Introduction to NestJS' },
        content: { type: 'string', example: 'NestJS is a framework...' },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            username: { type: 'string', example: 'john_doe' },
            email: { type: 'string', example: 'john@example.com' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Article not found' })
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

  @ApiOperation({ summary: 'Create a new article' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ 
    status: 201, 
    description: 'Article created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        title: { type: 'string', example: 'Introduction to NestJS' },
        content: { type: 'string', example: 'NestJS is a framework...' },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            username: { type: 'string', example: 'john_doe' },
            email: { type: 'string', example: 'john@example.com' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createArticleDto: CreateArticleDto, @Req() req: Request): Promise<Article> {
    // @ts-ignore
    return this.articleService.create(createArticleDto.title, createArticleDto.content, req.user).then(article => {
      if (article.user && 'password' in article.user) {
        const { password, ...userSafe } = article.user;
        article.user = userSafe as any;
      }
      return article;
    });
  }

  @ApiOperation({ summary: 'Update an article' })
  @ApiParam({ name: 'id', description: 'Article ID', example: 1 })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ 
    status: 200, 
    description: 'Article updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        title: { type: 'string', example: 'Updated: Introduction to NestJS' },
        content: { type: 'string', example: 'Updated content...' },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            username: { type: 'string', example: 'john_doe' },
            email: { type: 'string', example: 'john@example.com' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
    @Req() req: Request,
  ): Promise<Article | null> {
    const parsedId = typeof id === 'string' ? parseInt(id as any, 10) : id;
    // @ts-ignore
    const article = await this.articleService.update(parsedId as number, updateArticleDto, req.user);
    if (article && article.user && 'password' in article.user) {
      const { password, ...userSafe } = article.user;
      article.user = userSafe as any;
    }
    return article;
  }

  @ApiOperation({ summary: 'Delete an article' })
  @ApiParam({ name: 'id', description: 'Article ID', example: 1 })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ 
    status: 200, 
    description: 'Article deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request): Promise<{ success: boolean }> {
    const parsedId = typeof id === 'string' ? parseInt(id as any, 10) : id;
    // @ts-ignore
    const success = await this.articleService.remove(parsedId as number, req.user);
    return { success };
  }
}
