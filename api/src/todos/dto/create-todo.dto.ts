import {
  IsEnum,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TodoStatus } from '../entities/todo.entity.js';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;

  @IsOptional()
  @IsBoolean()
  starred?: boolean;
}
