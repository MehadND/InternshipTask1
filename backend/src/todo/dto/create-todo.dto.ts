import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsDateString,
  ValidateNested, // Add IsDate validator
} from 'class-validator';
import { CreateSubtaskDto } from './create-subtask.dto';

export class CreateTodoDto {
  id?: string;

  @IsString()
  @IsNotEmpty()
  taskTitle: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  taskDescription?: string;

  @IsBoolean()
  @IsOptional()
  isComplete?: boolean;

  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @ValidateNested({ each: true })
  @IsOptional()
  subtasks?: CreateSubtaskDto[];
}
