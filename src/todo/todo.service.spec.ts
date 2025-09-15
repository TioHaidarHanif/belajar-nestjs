import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from './todo.entity';

describe('TodoService', () => {
  let service: TodoService;
  let repo: any;

  const mockTodo: Todo = {
    id: 1,
    title: 'Test Todo',
    description: 'Test Desc',
    isDone: false,
  };

  const mockRepo = {
    find: jest.fn().mockResolvedValue([mockTodo]),
    findOneBy: jest.fn().mockResolvedValue(mockTodo),
    create: jest.fn().mockReturnValue(mockTodo),
    save: jest.fn().mockResolvedValue(mockTodo),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    repo = module.get(getRepositoryToken(Todo));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all todos', async () => {
    expect(await service.findAll()).toEqual([mockTodo]);
    expect(repo.find).toHaveBeenCalled();
  });

  it('should return a todo by id', async () => {
    expect(await service.findOne(1)).toEqual(mockTodo);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should create a todo', async () => {
    expect(await service.create('Test Todo', 'Test Desc')).toEqual(mockTodo);
    expect(repo.create).toHaveBeenCalledWith({ title: 'Test Todo', description: 'Test Desc' });
    expect(repo.save).toHaveBeenCalledWith(mockTodo);
  });

  it('should update a todo', async () => {
    expect(await service.update(1, { title: 'Updated' })).toEqual(mockTodo);
    expect(repo.update).toHaveBeenCalledWith(1, { title: 'Updated' });
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should remove a todo', async () => {
    await service.remove(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
  });
});
