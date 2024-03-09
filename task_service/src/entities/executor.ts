import {Entity, Column, PrimaryColumn, OneToMany} from 'typeorm';
import {Task} from "./task";

@Entity('executors')
export class Executor {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'text' })
  role: string;

  @OneToMany(() => Task, (task) => task.executors)
  tasks: Task[]
}
