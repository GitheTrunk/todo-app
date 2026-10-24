import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodosService } from './todos.service.js';
import { Todo } from './entities/todo.entity.js';

describe('TodosService', () => {
  let service: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Todo),
          useValue: {
            find: vi.fn(),
            findBy: vi.fn(),
            findOne: vi.fn(),
            findOneBy: vi.fn(),
            create: vi.fn(),
            save: vi.fn(),
            remove: vi.fn(),
            update: vi.fn(),
            createQueryBuilder: vi.fn(),
            manager: { transaction: vi.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
