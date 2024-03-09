import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Executor } from '../entities/executor';
import { Repository } from 'typeorm';

@Injectable()
export class AuthConsumer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    @InjectRepository(Executor)
    private executorsRepository: Repository<Executor>,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['users'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log('\n\n CONSUME MESSAGE START \N\N')
          console.log({
            value: message.value.toString(),
            topic: topic.toString(),
            partition: partition.toString(),
          });
          // todo save new executor id and role
          const executor = new Executor()
          executor.id = message.value?.object?.id;
          executor.role = message.value?.object?.role;
          await this.executorsRepository.save(executor)
        },
      },
    );
  }
}
