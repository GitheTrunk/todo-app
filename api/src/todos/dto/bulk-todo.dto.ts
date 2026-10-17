import { ArrayNotEmpty, IsArray, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { TodoStatus } from '../entities/todo.entity.js';

export class BulkTodoDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Min(1, { each: true })
  ids!: number[];

  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;
}
