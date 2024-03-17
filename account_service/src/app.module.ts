import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { ProducerService } from './kafka/producer/producer.service';
import { ConsumerService } from './kafka/consumers/consumer.service';

@Module({
  imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'accounts',
        synchronize: true,
      }),
    KafkaModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProducerService, ConsumerService],
})
export class AppModule {}
