import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '../../../../task_service/src/kafka/consumers/consumer.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Executor } from '../../../../task_service/src/entities/executor';
import { Repository } from 'typeorm';
import {TaskProcessingFactory} from "../../task-processing/task-processing.factory";

@Injectable()
export class TaskConsumer implements OnModuleInit {

  private factory: TaskProcessingFactory;

  constructor(
      private readonly consumerService: ConsumerService,
      @InjectRepository(Executor)
      private executorsRepository: Repository<Executor>,
  ) {
      this.factory = new TaskProcessingFactory();
  }

  async onModuleInit() {
    await this.consumerService.consume(
        { topics: ['v1.task.waterfall.assign', 'v1.task.waterfall.complete', 'v1.task.waterfall.create'] },
        {
          eachMessage: async ({ topic, partition, message }) => {
            console.log({
              value: message.value.toString(),
              topic: topic.toString(),
              partition: partition.toString(),
            });
            const runner = this.factory.create(topic)
            await runner.execute(message.value)
          },
        },
    );
  }
}
