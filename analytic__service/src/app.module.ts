import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { ConsumerService } from './kafka/consumer/consumer.service';

@Module({
  imports: [KafkaModule],
  // controllers: [AppController],
  providers: [AppService, ConsumerService],
})
export class AppModule {}
