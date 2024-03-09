import { Module } from '@nestjs/common';
import { ConsumerService } from './consumers/consumer.service';
import {AuthConsumer} from "./consumers/auth.consumer";
import {ProducerService} from "./producer/producer.service";
import {AssignProducer} from "./producer/assign.producer";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Executor} from "../entities/executor";

@Module({
  imports: [TypeOrmModule.forFeature([Executor])],
  providers: [ConsumerService, ProducerService, AuthConsumer, AssignProducer],
  exports: [ConsumerService, ProducerService, AuthConsumer, AssignProducer],
})
export class KafkaModule {}
