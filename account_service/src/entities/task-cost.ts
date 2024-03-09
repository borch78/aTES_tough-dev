import {Entity, Column, PrimaryColumn} from 'typeorm';

@Entity('task_cost')
export class TaskCost {
  @PrimaryColumn()
  taskId: number;

  @Column()
  cost: number;
}
