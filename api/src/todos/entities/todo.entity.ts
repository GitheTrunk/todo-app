import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TodoStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'varchar', default: TodoStatus.TODO })
  status: TodoStatus;

  @Column({ type: 'boolean', default: false })
  starred: boolean;

  @Column({ type: 'integer', default: 0 })
  position: number;
}
