import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}


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



  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() body: { title: string; description?: string }, @Req() req: Request): Promise<Todo> {
    // @ts-ignore
    return this.todoService.create(body.title, body.description, req.user).then(todo => {
      if (todo.user && 'password' in todo.user) {
        const { password, ...userSafe } = todo.user;
        todo.user = userSafe as any;
      }
      return todo;
    });
  }



  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<Todo>,
    @Req() req: Request,
  ): Promise<Todo> {
    // @ts-ignore
    const todo = await this.todoService.update(Number(id), body, req.user);
    if (!todo) {
      throw new Error('Todo not found');
    }
    if (todo.user && 'password' in todo.user) {
      const { password, ...userSafe } = todo.user;
      todo.user = userSafe as any;
    }
    return todo;
  }



  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request): Promise<void> {
    // @ts-ignore
    return this.todoService.remove(Number(id), req.user);
  }
}
