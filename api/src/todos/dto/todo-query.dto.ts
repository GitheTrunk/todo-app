import { IsEnum, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { TodoStatus } from '../entities/todo.entity.js';

export class TodoQueryDto {
  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  q?: string;

  @IsOptional()
  @IsIn(['true', 'false'])
  starred?: string;
}
