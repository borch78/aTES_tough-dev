import { Module } from '@nestjs/common';
import { ConsumerService } from './consumers/consumer.service';
import {ProducerService} from "./producer/producer.service";
import {TaskProducer} from "./producer/task.producer";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Executor} from "../entities/executor";
import {UserConsumer} from "./consumers/user.consumer";
import {MessageJornal} from "../entities/message-jornal";

@Module({
  imports: [TypeOrmModule.forFeature([Executor, MessageJornal])],
  providers: [ConsumerService, ProducerService, UserConsumer, TaskProducer],
  exports: [ConsumerService, ProducerService, UserConsumer, TaskProducer],
})
export class KafkaModule {}
