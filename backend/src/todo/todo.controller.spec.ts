import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

describe('TodoController - Unit Testing', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  const mockQuery = {
    limit: 5,
    skip: 0,
  };

  const mockTodo = {
    id: '6bc4eb1f-54ab-59b9-bcd1-0245d9a2fb07',
    taskTitle: 'taskTitle',
    taskDescription: 'taskDescription',
  };

  const mockTodoService = {
    findAll: jest.fn().mockResolvedValueOnce([mockTodo]),
    findOne: jest.fn().mockResolvedValueOnce(mockTodo),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn().mockResolvedValueOnce(mockTodo),
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

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
    expect(todoService).toBeDefined();
  });
});
