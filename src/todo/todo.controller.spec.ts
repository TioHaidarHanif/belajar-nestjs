import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  const mockUser = { id: 1, username: 'user1' };
  const mockTodo: Todo = {
    id: 1,
    title: 'Test Todo',
    description: 'Test Desc',
    isDone: false,
    user: mockUser as any,
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
    const req = { user: mockUser } as any;
    expect(await controller.findAll(req)).toEqual([mockTodo]);
    expect(service.findAll).toHaveBeenCalledWith(mockUser);
  });

  it('should return a todo by id', async () => {
    const req = { user: mockUser } as any;
    expect(await controller.findOne('1', req)).toEqual(mockTodo);
    expect(service.findOne).toHaveBeenCalledWith(1, mockUser);
  });

  it('should create a todo', async () => {
    const dto = { title: 'Test Todo', description: 'Test Desc' };
    const req = { user: mockUser } as any;
    expect(await controller.create(dto, req)).toEqual(mockTodo);
    expect(service.create).toHaveBeenCalledWith(dto.title, dto.description, mockUser);
  });

  it('should update a todo', async () => {
    const dto = { title: 'Updated' };
    const req = { user: mockUser } as any;
    expect(await controller.update('1', dto, req)).toEqual(mockTodo);
    expect(service.update).toHaveBeenCalledWith(1, dto, mockUser);
  });

  it('should remove a todo', async () => {
    const req = { user: mockUser } as any;
    expect(await controller.remove('1', req)).toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(1, mockUser);
  });
});
