import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaModule } from './kafka/kafka.module';
import {Executor} from "./entities/executor";
import {Task} from "./entities/task";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'tasks',
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Executor, Task]),
    KafkaModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
