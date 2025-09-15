
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { User } from '../user/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  findAll(user: User): Promise<Todo[]> {
    return this.todoRepository.find({ where: { user: { id: user.id } } });
  }

  findOne(id: number, user: User): Promise<Todo | null> {
    return this.todoRepository.findOne({ where: { id, user: { id: user.id } } });
  }

  create(title: string, description: string | undefined, user: User): Promise<Todo> {
    const todo = this.todoRepository.create({ title, description, user });
    return this.todoRepository.save(todo);
  }

  async update(id: number, data: Partial<Todo>, user: User): Promise<Todo | null> {
    const todo = await this.todoRepository.findOne({ where: { id, user: { id: user.id } } });
    if (!todo) return null;
    await this.todoRepository.update(id, { ...data, user });
    return this.todoRepository.findOne({ where: { id, user: { id: user.id } } });
  }

  async remove(id: number, user: User): Promise<void> {
    const todo = await this.todoRepository.findOne({ where: { id, user: { id: user.id } } });
    if (todo) {
      await this.todoRepository.delete(id);
    }
  }
}
