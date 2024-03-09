import { Module } from '@nestjs/common';
import { ConsumerService } from './consumers/consumer.service';
import {UserConsumer} from "./consumers/user.consumer";
import {ProducerService} from "./producer/producer.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OperationsLog} from "../entities/operations-log";
import {TaskConsumer} from "./consumers/task.consumer";

@Module({
  imports: [TypeOrmModule.forFeature([OperationsLog])],
  providers: [ConsumerService, ProducerService, UserConsumer, TaskConsumer],
  exports: [ConsumerService, ProducerService, UserConsumer, TaskConsumer],
})
export class KafkaModule {}
