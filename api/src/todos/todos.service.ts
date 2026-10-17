import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Todo, TodoStatus } from './entities/todo.entity.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { TodoQueryDto } from './dto/todo-query.dto.js';
import { BulkTodoDto } from './dto/bulk-todo.dto.js';
import { TodoOrderDto } from './dto/todo-order.dto.js';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private readonly todosRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const [lastTodo] = await this.todosRepository.find({
      order: { position: 'DESC' },
      take: 1,
    });
    const todo = this.todosRepository.create({
      ...createTodoDto,
      status: createTodoDto.status ?? TodoStatus.TODO,
      position: (lastTodo?.position ?? -1) + 1,
    });
    return this.todosRepository.save(todo);
  }

  findAll(query: TodoQueryDto = {}): Promise<Todo[]> {
    const builder = this.todosRepository
      .createQueryBuilder('todo')
      .orderBy('todo.position', 'ASC')
      .addOrderBy('todo.id', 'ASC');

    if (query.status) builder.andWhere('todo.status = :status', { status: query.status });
    if (query.q?.trim()) builder.andWhere('todo.title ILIKE :q', { q: `%${query.q.trim()}%` });
    if (query.starred !== undefined) {
      builder.andWhere('todo.starred = :starred', { starred: query.starred === 'true' });
    }

    return builder.getMany();
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todosRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);
    Object.assign(todo, updateTodoDto);
    return this.todosRepository.save(todo);
  }

  async remove(id: number): Promise<void> {
    const todo = await this.findOne(id);
    await this.todosRepository.remove(todo);
  }

  async bulk(bulkTodoDto: BulkTodoDto): Promise<Todo[] | { deleted: number }> {
    const ids = [...new Set(bulkTodoDto.ids)];
    if (ids.length !== bulkTodoDto.ids.length) {
      throw new BadRequestException('Todo IDs must be unique');
    }

    const existing = await this.todosRepository.findBy({ id: In(ids) });
    if (existing.length !== ids.length) {
      throw new NotFoundException('One or more todos were not found');
    }

    if (bulkTodoDto.status) {
      await this.todosRepository.update({ id: In(ids) }, { status: bulkTodoDto.status });
      return this.todosRepository.find({
        where: { id: In(ids) },
        order: { position: 'ASC', id: 'ASC' },
      });
    }

    await this.todosRepository.remove(existing);
    return { deleted: ids.length };
  }

  async updateOrder(todoOrderDto: TodoOrderDto): Promise<Todo[]> {
    const ids = [...new Set(todoOrderDto.ids)];
    if (ids.length !== todoOrderDto.ids.length) {
      throw new BadRequestException('Todo IDs must be unique');
    }

    const existing = await this.todosRepository.findBy({ id: In(ids) });
    if (existing.length !== ids.length) {
      throw new NotFoundException('One or more todos were not found');
    }

    await this.todosRepository.manager.transaction(async (manager) => {
      for (const [position, id] of ids.entries()) {
        await manager.update(Todo, { id }, { position });
      }
    });

    return this.todosRepository.find({ order: { position: 'ASC', id: 'ASC' } });
  }
}
