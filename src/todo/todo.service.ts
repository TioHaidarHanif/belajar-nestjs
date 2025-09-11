import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './todo.entity';

@Injectable()
export class TodoService {
  private todos: Todo[] = [];
  private idCounter = 1;

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    const todo = this.todos.find(todo => todo.id === id);
    if (!todo) {
      throw new NotFoundException(`Todo dengan id ${id} tidak ditemukan`);
    }
    return todo;
  }

  create(title: string, description?: string): Todo {
    const newTodo: Todo = {
      id: this.idCounter++,
      title,
      description,
      isDone: false,
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  update(id: number, updateData: Partial<Todo>): Todo {
    const todo = this.findOne(id); // ✅ aman, karena sudah pasti ada
    Object.assign(todo, updateData);
    return todo;
  }

  remove(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }
}
