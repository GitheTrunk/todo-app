import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { TodoQueryDto } from './dto/todo-query.dto.js';
import { BulkTodoDto } from './dto/bulk-todo.dto.js';
import { TodoOrderDto } from './dto/todo-order.dto.js';
import { OptionalAuthGuard } from '../auth/auth.guard.js';
import type { AuthUserPayload } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { Public } from '../auth/auth.guard.js';

@Controller('todos')
@Public()
@UseGuards(OptionalAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(
    @Body() createTodoDto: CreateTodoDto,
    @CurrentUser() user?: AuthUserPayload,
  ) {
    return this.todosService.create(createTodoDto, user?.id);
  }

  @Get()
  findAll(
    @Query() query: TodoQueryDto,
    @CurrentUser() user?: AuthUserPayload,
  ) {
    return this.todosService.findAll(query, user?.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.findOne(id);
  }

  @Patch('bulk')
  bulk(@Body() bulkTodoDto: BulkTodoDto) {
    return this.todosService.bulk(bulkTodoDto);
  }

  @Patch('order')
  order(@Body() todoOrderDto: TodoOrderDto) {
    return this.todosService.updateOrder(todoOrderDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.remove(id);
  }
}
