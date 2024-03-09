import { Module } from '@nestjs/common';
import { ConsumerService } from './consumers/consumer.service';
import {ProducerService} from "./producer/producer.service";
import {AssignProducer} from "./producer/assign.producer";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Executor} from "../entities/executor";
import {UserConsumer} from "./consumers/user.consumer";

@Module({
  imports: [TypeOrmModule.forFeature([Executor])],
  providers: [ConsumerService, ProducerService, UserConsumer, AssignProducer],
  exports: [ConsumerService, ProducerService, UserConsumer, AssignProducer],
})
export class KafkaModule {}
