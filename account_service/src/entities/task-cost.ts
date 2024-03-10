import {Entity, Column, PrimaryColumn} from 'typeorm';

@Entity('task_cost')
export class TaskCost {
  @PrimaryColumn()
  taskId: number;

  @Column()
  cost: number;

  @Column({ name: 'is_done', default: false })
  isDone: boolean = false;

  @Column({ type: 'timestamp' })
  createdAt: Date = new Date();
}
