import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll(): Todo[] {
    return this.todoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Todo {
    return this.todoService.findOne(Number(id));
  }

  @Post()
  create(@Body() body: { title: string; description?: string }): Todo {
    return this.todoService.create(body.title, body.description);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { title?: string; description?: string; isDone?: boolean },
  ): Todo {
    return this.todoService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string): void {
    return this.todoService.remove(Number(id));
  }
}
