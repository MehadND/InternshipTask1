import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { Todo } from './schemas/todo.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('TodoService', () => {
  let todoService: TodoService;
  let todoModel: Model<Todo>;

  const todos: Todo[] = [];

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
      providers: [
        TodoService,
        { provide: getModelToken(Todo.name), useValue: mockTodoService },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
    todoModel = module.get<Model<Todo>>(getModelToken(Todo.name));
  });

  it('should be defined', () => {
    expect(todoService).toBeDefined();
  });

  // it('should create a new todo with valid payload', async () => {
  //   const createTodoDto={
  //     taskTitle: 'taskTitle',
  //     taskDescription: 'taskDescription',
  //     isComplete: false,
  //     createdAt: new Date(),
  //   };

  //   jest.spyOn(todoService, 'create').mockImplementation(()=>Promise.resolve(createTodoDto))

  //   expect(mockTodoService.create).toHaveBeenCalledWith(createTodoDto);
  //   expect(todo.taskTitle).toBe(createTodoDto.taskTitle);
  //   expect(todo.taskDescription).toBe(createTodoDto.taskDescription);
  //   expect(todo.isComplete).toBe(createTodoDto.isComplete);
  //   expect(todo.createdAt).toBe(createTodoDto.createdAt);
  // })
});
