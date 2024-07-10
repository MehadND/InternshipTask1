import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubtaskDto {
  @ApiProperty({
    example: '667e59ff26682bd670d72467',
    required: true,
    uniqueItems: true,
  })
  id?: string;

  @ApiProperty({
    example: 'Subtask Title',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'false',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isComplete?: boolean;
}
