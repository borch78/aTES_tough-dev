import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskStatus } from './entities/task';
import { Repository } from 'typeorm';
import { Executor } from './entities/executor';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Executor)
    private executorsRepository: Repository<Executor>,
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
  ) {}
  createTask(data): Promise<Task> {
    const task = new Task();
    task.description = data.description;
    task.executorId = data.executorId;
    task.status = TaskStatus.WIP;
    return this.tasksRepository.save(task);
  }

  getTasks(id: string): Promise<Task[]> {
    return this.tasksRepository.find({ where: { executorId: id } });
  }

  async changeStatus(id: number): Promise<void> {
    await this.tasksRepository.update(id, { status: TaskStatus.Complete });
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
