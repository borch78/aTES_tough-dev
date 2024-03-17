import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Executor } from '../../entities/executor';
import { Repository } from 'typeorm';

@Injectable()
export class UserConsumer implements OnModuleInit {
  constructor(
      private readonly consumerService: ConsumerService,
      @InjectRepository(Executor)
      private executorsRepository: Repository<Executor>,
  ) {}

  async onModuleInit(){
    await this.consumerService.consume(
        { topics: ['v1.user'] },
        {
          eachMessage: async ({ topic, partition, message }) => {
            console.log({
              value: message.value.toString(),
              topic: topic.toString(),
              partition: partition.toString(),
            });
            // todo save new executor id and role
            const eventData = JSON.parse(message.value.toString());
            const executor = new Executor()
            executor.id = eventData?.extendedUser?.id;
            executor.role = eventData?.extendedUser?.role ?? 'popug';
            await this.executorsRepository.save(executor)
          },
        },
    );
  }
}
