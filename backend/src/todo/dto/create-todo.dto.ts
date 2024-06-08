import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

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

  createdAt?: Date;
}
