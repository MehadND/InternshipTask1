import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { SubtaskDto } from './dto/subtask.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './schemas/todo.schema';
import { TodoService } from './todo.service';

@ApiTags('Todo')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // CRUD routes for todo

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The todo has been successfully created.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiBody({
    type: CreateTodoDto,
    description: 'Json structure for body for creating task',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All todos have been successfully fetched.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No todos found.',
  })
  @ApiQuery({
    name: 'limit',
    description: 'items per page',
    required: false,
    schema: {
      type: 'number',
      minimum: 4,
      default: 4,
    },
  })
  @ApiQuery({
    name: 'page',
    description: 'The page to display the results',
    required: false,
    schema: {
      type: 'number',
      minimum: 1,
      default: 1,
    },
  })
  @ApiQuery({
    name: 'sort',
    description: 'Sort by ascending or descending',
    required: false,
    schema: {
      type: 'string',
      default: 'createdAt',
    },
  })
  @ApiQuery({
    name: 'order',
    description: 'The order to order the items',
    required: false,
    schema: {
      type: 'string',
      default: 'desc',
    },
  })
  async findAll(
    @Query('limit') limit: number = 4,
    @Query('page') page: number = 1,
    @Query('sort') sort: string = 'createdAt',
    @Query('order') order: string = 'desc',
  ): Promise<{ data: Todo[]; pagination: SubtaskDto }> {
    return this.todoService.findAll(limit, page, sort, order);
  }

  @Get('completed')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All completed todos have been successfully fetched.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No completed todos found.',
  })
  async findAllCompleted(): Promise<{ data: Todo[] }> {
    return this.todoService.findAllCompleted();
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Todo by id has been successfully fetched.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No todo found for given id.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'No todo found for given id because of invalid id.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the todo.',
    type: 'uuid',
    required: true,
  })
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Todo by id has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the todo.',
    type: 'uuid',
    required: true,
  })
  @ApiBody({
    type: UpdateTodoDto,
    description: 'Json structure for body for updating task.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Todo by id has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No todo found for given id.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'No todo found for given id because of invalid id.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the todo.',
    type: 'uuid',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.todoService.remove(id);
  }

  // CRUD routes for subtasks functionality

  @Post(':taskId/subtasks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  removeSubtask(
    @Param('taskId') taskId: string,
    @Param('subtaskId') subtaskId: string,
  ) {
    return this.todoService.removeSubtask(taskId, subtaskId);
  }

  // route for generating task description using AI

  @Post('generate/description')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task Description generated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No todo found for given id.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'No todo found for given id because of invalid id.',
  })
  @ApiBody({
    type: String,
    required: true,
    description: 'Task Title used in prompt for generating task description.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  generateDescription(@Body('taskTitle') taskTitle: string) {
    return this.todoService.generatedescription(taskTitle);
  }

  // route for search functionality

  @Get('search/all')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All todos have been successfully fetched.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No todos found.',
  })
  findAllForSearch(): Promise<{ data: Todo[] }> {
    return this.todoService.findAllForSearch();
  }
}
