import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskStatus } from './entities/task';
import { Repository } from 'typeorm';
import { Executor } from './entities/executor';
import {AssignProducer} from "./kafka/producer/assign.producer";

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Executor)
    private executorsRepository: Repository<Executor>,
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
    private producer: AssignProducer,
  ) {}
  async createTask(data): Promise<Task> {
    const task = new Task();
    task.description = data.description;
    task.executorId = data.executorId;
    task.status = TaskStatus.WIP;
    const result = await this.tasksRepository.save(task);
    await this.producer.completeTask(result);
    return result;
  }

  getTasks(id: string): Promise<Task[]> {
    return this.tasksRepository.find({ where: { executorId: id } });
  }

  async changeStatus(id: number): Promise<void> {
    await this.tasksRepository.update(id, { status: TaskStatus.Complete });
    const task = await this.tasksRepository.findOne({ where: { id } })
    await this.producer.completeTask(task);
  }

  async shuffleTask() {
    const tasks = await this.tasksRepository.find({
      where: { status: TaskStatus.WIP },
    });
    const executors = await this.executorsRepository.find({
      where: { role: 'popug' },
    });
    const newExecutors = this.shuffle<Executor>(executors);
    for (const [index, task] of tasks.entries()) {
      if (newExecutors[index]) {
        task.executorId = newExecutors[index].id;
      }
    }
    await this.tasksRepository.save(tasks);
    await this.producer.assignTasks(tasks);
  }

  private shuffle<T>(array: T[]): T[] {
    let currentIndex = array?.length;
    let randomIndex;
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }
}
