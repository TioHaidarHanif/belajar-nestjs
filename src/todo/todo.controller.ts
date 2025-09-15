import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Todo> {
    const todo = await this.todoService.findOne(Number(id));
    if (!todo) {
      throw new Error('Todo not found');
    }
    return todo;
  }

  @Post()
  create(@Body() body: { title: string; description?: string }): Promise<Todo> {
    return this.todoService.create(body.title, body.description);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<Todo>,
  ): Promise<Todo> {
    const todo = await this.todoService.update(Number(id), body);
    if (!todo) {
      throw new Error('Todo not found');
    }
    return todo;
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.todoService.remove(Number(id));
  }
}
