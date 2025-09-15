import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  const mockTodo: Todo = {
    id: 1,
    title: 'Test Todo',
    description: 'Test Desc',
    isDone: false,
  };

  const mockTodoService = {
    findAll: jest.fn().mockResolvedValue([mockTodo]),
    findOne: jest.fn().mockResolvedValue(mockTodo),
    create: jest.fn().mockResolvedValue(mockTodo),
    update: jest.fn().mockResolvedValue(mockTodo),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: mockTodoService,
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all todos', async () => {
    expect(await controller.findAll()).toEqual([mockTodo]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a todo by id', async () => {
    expect(await controller.findOne('1')).toEqual(mockTodo);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should create a todo', async () => {
    const dto = { title: 'Test Todo', description: 'Test Desc' };
    expect(await controller.create(dto)).toEqual(mockTodo);
    expect(service.create).toHaveBeenCalledWith(dto.title, dto.description);
  });

  it('should update a todo', async () => {
    const dto = { title: 'Updated' };
    expect(await controller.update('1', dto)).toEqual(mockTodo);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove a todo', async () => {
    expect(await controller.remove('1')).toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
