import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  findAll(): Promise<Todo[]> {
    return this.todoRepository.find();
  }

  findOne(id: number): Promise<Todo | null> {
    return this.todoRepository.findOneBy({ id });
  }

  create(title: string, description?: string): Promise<Todo> {
    const todo = this.todoRepository.create({ title, description });
    return this.todoRepository.save(todo);
  }

  async update(id: number, data: Partial<Todo>): Promise<Todo | null> {
    await this.todoRepository.update(id, data);
    return this.todoRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.todoRepository.delete(id);
  }
}
