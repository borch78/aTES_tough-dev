import {Entity, Column, PrimaryColumn, OneToMany} from 'typeorm';
import {Task} from "./task";

@Entity()
export class Executor {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'text' })
  role: string;

  @OneToMany(() => Task, (task) => task.executors)
  tasks: Task[]
}
