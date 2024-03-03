import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Executor } from './executor';

export enum TaskStatus {
  WIP = 'wip',
  Complete = 'complete',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum' })
  status: TaskStatus;

  @Column({ name: 'executor_id' })
  executorId: string;

  @ManyToOne(() => Executor, (executor) => executor.id)
  executors: Executor[];
}
