import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested, // Add IsDate validator
} from 'class-validator';
import { CreateSubtaskDto } from './create-subtask.dto';

export class CreateTodoDto {
  @ApiProperty({
    example: '667e59bc26682bd670d7245a',
    required: true,
    uniqueItems: true,
  })
  id?: string;

  @ApiProperty({
    example: 'This is a task.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  taskTitle: string;

  @ApiProperty({
    example: 'Description about certain task.',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  taskDescription?: string;

  @ApiProperty({
    example: 'true',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isComplete?: boolean;

  @ApiProperty({
    example: '2024-07-10T19:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({
    required: false,
    type: () => CreateSubtaskDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @IsOptional()
  subtasks?: CreateSubtaskDto[];
}
