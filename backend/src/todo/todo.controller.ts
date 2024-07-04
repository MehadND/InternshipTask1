import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './schemas/todo.schema';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Throttle } from '@nestjs/throttler';
import { CreateTodoDto } from './dto/create-todo.dto';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { SubtaskDto } from './dto/subtask.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // CRUD routes for todo

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  async findAll(
    @Query('limit') limit: number = 4,
    @Query('page') page: number = 1,
    @Query('sort') sort: string = 'createdAt',
    @Query('order') order: string = 'desc',
  ): Promise<{ data: Todo[]; pagination: SubtaskDto }> {
    return this.todoService.findAll(limit, page, sort, order);
  }

  @Get('completed')
  async findAllCompleted(): Promise<{ data: Todo[] }> {
    return this.todoService.findAllCompleted();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.todoService.remove(id);
  }

  // CRUD routes for subtasks functionality

  @Post(':taskId/subtasks')
  @UseGuards(JwtAuthGuard)
  createSubtask(
    @Param('taskId') taskId: string,
    @Body() createSubtaskDto: CreateSubtaskDto,
  ) {
    return this.todoService.createSubtask(taskId, createSubtaskDto);
  }

  @Get(':taskId/subtasks')
  findAllSubtask(@Param('taskId') taskId: string) {
    return this.todoService.findAllSubtask(taskId);
  }

  @Delete(':taskId/subtasks/:subtaskId')
  @UseGuards(JwtAuthGuard)
  removeSubtask(
    @Param('taskId') taskId: string,
    @Param('subtaskId') subtaskId: string,
  ) {
    return this.todoService.removeSubtask(taskId, subtaskId);
  }

  // route for generating task description using AI

  @Post('generate/description')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  generateDescription(@Body('taskTitle') taskTitle: string) {
    return this.todoService.generatedescription(taskTitle);
  }

  // route for search functionality

  @Get('search/all')
  findAllForSearch(): Promise<{ data: Todo[] }> {
    return this.todoService.findAllForSearch();
  }
}
