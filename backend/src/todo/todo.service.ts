import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Model, Types } from 'mongoose';
import { Todo } from './schemas/todo.schema';
import { InjectModel } from '@nestjs/mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Subtask } from './schemas/subtask.schema';
import { CreateSubtaskDto } from './dto/create-subtask.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name)
    private readonly todoModel: Model<Todo>,
  ) {}

  async generatedescription(taskTitle: string): Promise<string> {
    try {
      const genAI = new GoogleGenerativeAI(
        'AIzaSyCP5sKPuSjTT2lf-I0CerE0LPA-XLeCEgQ',
      );

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Generate a short task description for a task titled: "${taskTitle}". Give me the description in plain text and do not write title`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      if (!response) {
        throw new HttpException('Over using API', HttpStatus.TOO_MANY_REQUESTS);
      }
      const text = response.text();
      return text;
    } catch (error) {
      console.error('Error generating task description:', error);
    }
    // return 'This action adds a new todo';
  }

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    try {
      const createdTodo = new this.todoModel(createTodoDto);
      return await createdTodo.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      } else if (error.name === 'MongoError' && error.code === 11000) {
        throw new BadRequestException('Duplicate data error');
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
    // return 'This action adds a new todo';
  }

  async createSubtask(
    taskId: string,
    createSubtaskDto: CreateSubtaskDto,
  ): Promise<Subtask> {
    try {
      const todo = await this.todoModel.findById(taskId).exec();

      if (!todo) {
        throw new NotFoundException('Todo Not Found');
      }

      const newSubtask = {
        _id: new Types.ObjectId(),
        title: createSubtaskDto.title,
        isComplete: createSubtaskDto.isComplete,
      };

      todo.subtasks.push(newSubtask);

      await todo.save();

      return newSubtask;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid ID');
      }
      throw error;
    }
    // return 'This action adds a new todo';
  }

  async findAllSubtask(taskId: string): Promise<Subtask[]> {
    try {
      const todo = await this.todoModel.findById(taskId).exec();

      if (!todo) {
        throw new NotFoundException('Todo Not Found');
      }
      const subtasks = todo.subtasks;

      return subtasks;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid ID');
      }
      throw error;
    }
    // return `This action returns a #${id} todo`;
  }

  async removeSubtask(taskId: string, subtaskId: string): Promise<Subtask> {
    try {
      const todo = await this.todoModel.findById(taskId).exec();

      if (!todo) {
        throw new NotFoundException('Todo Not Found');
      }

      const subtaskIndex = todo.subtasks.findIndex(
        (subtask) => subtask._id.toString() === subtaskId,
      );

      if (subtaskIndex === -1) {
        throw new NotFoundException('Subtask Not Found');
      }
      const deletedSubtask = todo.subtasks[subtaskIndex];
      todo.subtasks.splice(subtaskIndex, 1); // Remove the subtask
      await todo.save(); // Save the updated todo

      return deletedSubtask;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid ID');
      }
      throw error;
    }
  }

  async findAll(
    limit: number,
    page: number,
    sort: string,
    order: string,
  ): Promise<{ data: Todo[]; pagination: any }> {
    const sortOrder = order === 'desc' ? 1 : -1;
    const skip = (page - 1) * limit;

    const [total, todos] = await Promise.all([
      this.todoModel.countDocuments({ isComplete: false }).exec(), // Filter only incomplete todos
      this.todoModel
        .find({ isComplete: false }) // Filter only incomplete todos
        .sort({ [sort]: sortOrder })
        .limit(limit)
        .skip(skip >= 0 ? skip : 0)
        .exec(),
    ]);

    if (!todos || page > Math.ceil(total / limit)) {
      throw new NotFoundException('Todo Not Found');
    }

    return {
      data: todos,
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        itemsPerPage: limit,
      },
    };
  }

  async findAllCompleted(): Promise<{ data: Todo[] }> {
    const [total, todos] = await Promise.all([
      this.todoModel.countDocuments().exec(),
      this.todoModel.find().exec(),
    ]);

    const finalTodos = todos.filter((todo) => todo.isComplete !== false);

    if (!todos) {
      throw new NotFoundException('Todo Not Found');
    }

    return {
      data: finalTodos,
    };
    // return `This action returns all todo`;
  }

  async findOne(id: string): Promise<Todo> {
    try {
      const todo = await this.todoModel.findById(id).exec();

      if (!todo) {
        throw new NotFoundException('Todo Not Found');
      }

      return todo;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid ID');
      }
      throw error;
    }
    // return `This action returns a #${id} todo`;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    try {
      console.log('Due Date --> ' + updateTodoDto.dueDate);
      const update: Partial<UpdateTodoDto & { updatedAt: Date }> = {};
      if (updateTodoDto.taskTitle !== undefined) {
        update.taskTitle = updateTodoDto.taskTitle;
      }
      if (updateTodoDto.taskDescription !== undefined) {
        update.taskDescription = updateTodoDto.taskDescription;
      }
      if (updateTodoDto.isComplete !== undefined) {
        update.isComplete = updateTodoDto.isComplete;
      }
      if (updateTodoDto.dueDate !== undefined) {
        update.dueDate = updateTodoDto.dueDate;
      }

      update.updatedAt = new Date();

      const updatedTodo = await this.todoModel
        .findByIdAndUpdate(id, update, { new: true })
        .exec();

      if (!updatedTodo) {
        throw new NotFoundException('Todo Not Found');
      }

      return updatedTodo;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid ID');
      } else if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
    // return `This action updates a #${id} todo`;
  }

  async remove(id: string): Promise<Todo> {
    try {
      const deletedTodo = await this.todoModel.findByIdAndDelete(id).exec();

      if (!deletedTodo) {
        throw new NotFoundException('Todo Not Found');
      }

      return deletedTodo;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid ID');
      }
      throw error;
    }
    // return `This action removes a #${id} todo`;
  }
}
