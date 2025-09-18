import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Todos')
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @ApiOperation({ summary: 'Get all todos for authenticated user' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ 
    status: 200, 
    description: 'List of todos retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          title: { type: 'string', example: 'Complete project documentation' },
          description: { type: 'string', example: 'Write comprehensive API documentation' },
          isDone: { type: 'boolean', example: false },
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
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Req() req: Request): Promise<Todo[]> {
    // @ts-ignore
    return this.todoService.findAll(req.user).then(todos =>
      todos.map(todo => {
        if (todo.user && 'password' in todo.user) {
          const { password, ...userSafe } = todo.user;
          todo.user = userSafe as any;
        }
        return todo;
      })
    );
  }

  @ApiOperation({ summary: 'Get a specific todo by ID' })
  @ApiParam({ name: 'id', description: 'Todo ID', example: 1 })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ 
    status: 200, 
    description: 'Todo retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        title: { type: 'string', example: 'Complete project documentation' },
        description: { type: 'string', example: 'Write comprehensive API documentation' },
        isDone: { type: 'boolean', example: false },
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
  @ApiResponse({ status: 404, description: 'Todo not found' })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request): Promise<Todo> {
    // @ts-ignore
    const todo = await this.todoService.findOne(Number(id), req.user);
    if (!todo) {
      throw new Error('Todo not found');
    }
    if (todo.user && 'password' in todo.user) {
      const { password, ...userSafe } = todo.user;
      todo.user = userSafe as any;
    }
    return todo;
  }


  @ApiOperation({ summary: 'Create a new todo' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ 
    status: 201, 
    description: 'Todo created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        title: { type: 'string', example: 'Complete project documentation' },
        description: { type: 'string', example: 'Write comprehensive API documentation' },
        isDone: { type: 'boolean', example: false },
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
  create(@Body() createTodoDto: CreateTodoDto, @Req() req: Request): Promise<Todo> {
    // @ts-ignore
    return this.todoService.create(createTodoDto.title, createTodoDto.description, req.user).then(todo => {
      if (todo.user && 'password' in todo.user) {
        const { password, ...userSafe } = todo.user;
        todo.user = userSafe as any;
      }
      return todo;
    });
  }

  @ApiOperation({ summary: 'Update a todo' })
  @ApiParam({ name: 'id', description: 'Todo ID', example: 1 })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ 
    status: 200, 
    description: 'Todo updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        title: { type: 'string', example: 'Updated project documentation' },
        description: { type: 'string', example: 'Updated description' },
        isDone: { type: 'boolean', example: true },
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
  @ApiResponse({ status: 404, description: 'Todo not found' })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req: Request,
  ): Promise<Todo> {
    // @ts-ignore
    const todo = await this.todoService.update(Number(id), updateTodoDto, req.user);
    if (!todo) {
      throw new Error('Todo not found');
    }
    if (todo.user && 'password' in todo.user) {
      const { password, ...userSafe } = todo.user;
      todo.user = userSafe as any;
    }
    return todo;
  }

  @ApiOperation({ summary: 'Delete a todo' })
  @ApiParam({ name: 'id', description: 'Todo ID', example: 1 })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Todo deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request): Promise<void> {
    // @ts-ignore
    return this.todoService.remove(Number(id), req.user);
  }
}
