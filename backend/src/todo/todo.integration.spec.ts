import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Connection } from 'mongoose';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './schemas/todo.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';

describe('TodoController - Integration Testing', () => {
  let app: INestApplication;
  let todoController: TodoController;
  let todoService: TodoService;
  let database: MongoMemoryServer;
  let dbConnection: Connection;

  beforeAll(async () => {
    database = await MongoMemoryServer.create();
    const uri = await database.getUri();
    // dbConnection = await mongoose.connect(uri, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        PassportModule,
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
      ],
      controllers: [TodoController],
      providers: [TodoService],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    // app.useGlobalInterceptors(new ResponseInterceptor());
    await app.init();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
    dbConnection = module.get<Connection>(getConnectionToken());
  });

  afterAll(async () => {
    await dbConnection.dropDatabase();
    await app.close();
    await database.stop();
  });

  beforeEach(async () => {
    await dbConnection.collection('todo').deleteMany({});
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
    expect(todoService).toBeDefined();
  });

  it('should create a new todo given valid payload', async () => {
    const payload = {
      taskTitle: 'Test Task',
      taskDescription: 'Test Description',
    };

    const todo = await todoController.create(payload);
    expect(todo).toBeDefined();
    expect(todo.taskTitle).toBe(payload.taskTitle);
    expect(todo.taskDescription).toBe(payload.taskDescription);
  });

  it('should return a list of all todos', async () => {
    const payload = {
      taskTitle: 'Test Task',
      taskDescription: 'Test Description',
    };

    await todoController.create(payload);

    const result = await todoController.findAll();

    expect(result.data.length).toBeGreaterThan(0);
  });

  it('should return a single todo given valid id', async () => {
    const payload = {
      taskTitle: 'Test Task',
      taskDescription: 'Test Description',
    };

    const todo = await todoController.create(payload);

    const result = await todoController.findOne(todo.id);

    expect(result).toBeDefined();
    expect(result.taskTitle).toBe(payload.taskTitle);
    expect(result.taskDescription).toBe(payload.taskDescription);
  });

  it('should update a todo given valid id', async () => {
    const payload = {
      taskTitle: 'Test Task',
      taskDescription: 'Test Description',
    };
    const newTodo = await todoController.create(payload);
    const result = await todoController.update(newTodo.id, {
      taskTitle: 'Updated Title',
      taskDescription: 'Updated Description',
    });

    expect(result.taskTitle).toBe('Updated Title');
    expect(result.taskDescription).toBe('Updated Description');
  });

  it('should delete a todo given valid id', async () => {
    const payload = {
      taskTitle: 'Test Task',
      taskDescription: 'Test Description',
    };
    const deleteTodo = await todoController.create(payload);
    const result = await todoController.remove(deleteTodo.id);

    expect(result.taskTitle).toBe(payload.taskTitle);
    expect(result.taskDescription).toBe(payload.taskDescription);
    // expect(result.statusCode).toBe(HttpStatus.OK);
  });

  it('should return a Invalid ID error message for giving invalid id when find by id', async () => {
    try {
      const payload = {
        taskTitle: 'Test Task',
        taskDescription: 'Test Description',
      };
      await todoController.create(payload);
      await todoController.findOne('1');
    } catch (error) {
      expect(error.message).toBe('Invalid ID');
    }
  });

  it('should return a Invalid ID error message for giving invalid id when updating todo', async () => {
    try {
      const payload = {
        taskTitle: 'Test Task',
        taskDescription: 'Test Description',
      };
      await todoController.create(payload);
      await todoController.update('1', {
        taskTitle: 'Updated Title',
        taskDescription: 'Updated Description',
      });
    } catch (error) {
      expect(error.message).toBe('Invalid ID');
    }
  });

  it('should return a Invalid ID error message for giving invalid id when delete by id', async () => {
    try {
      const payload = {
        taskTitle: 'Test Task',
        taskDescription: 'Test Description',
      };
      await todoController.create(payload);
      await todoController.remove('1');
    } catch (error) {
      expect(error.message).toBe('Invalid ID');
    }
  });

  it('should return a Todo Not Found error message for giving an id that does not exist when find by id', async () => {
    try {
      const payload = {
        taskTitle: 'Test Task',
        taskDescription: 'Test Description',
      };
      await todoController.create(payload);
      await todoController.findOne('5f92cbf10cf217478ba93561');
    } catch (error) {
      expect(error.message).toBe('Todo Not Found');
    }
  });

  it('should return a Todo Not Found error message for giving an id that does not exist when update by id', async () => {
    try {
      const payload = {
        taskTitle: 'Test Task',
        taskDescription: 'Test Description',
      };
      await todoController.create(payload);
      await todoController.update('5f92cbf10cf217478ba93561', {
        taskTitle: 'Updated Title',
        taskDescription: 'Updated Description',
      });
    } catch (error) {
      expect(error.message).toBe('Todo Not Found');
    }
  });

  it('should return a Todo Not Found error message for giving an id that does not exist when delete by id', async () => {
    try {
      const payload = {
        taskTitle: 'Test Task',
        taskDescription: 'Test Description',
      };
      await todoController.create(payload);
      await todoController.remove('5f92cbf10cf217478ba93561');
    } catch (error) {
      expect(error.message).toBe('Todo Not Found');
    }
  });

  it('should return a Todo validation failed: taskTitle: Path `taskTitle` is required. error message for giving an invalid payload when creating a todo', async () => {
    try {
      const invalidPayload = {
        taskTitle: '',
      };
      await todoController.create(invalidPayload);
    } catch (error) {
      expect(error.message).toBe(
        'Todo validation failed: taskTitle: Path `taskTitle` is required.',
      );
    }
  });

  it('should return a Todo validation failed: taskTitle: Path `taskTitle` is required. error message for giving an invalid payload when updating a todo', async () => {
    try {
      const invalidPayload = {
        taskTitle: '',
      };
      const newTodo = await todoController.create(invalidPayload);
      await todoController.update(newTodo.id, invalidPayload);
    } catch (error) {
      expect(error.message).toBe(
        'Todo validation failed: taskTitle: Path `taskTitle` is required.',
      );
    }
  });
});
