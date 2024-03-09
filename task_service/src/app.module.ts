import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaModule } from './kafka/kafka.module';
import { AuthConsumer } from './kafka/auth.consumer';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'db',
      entities: ["src/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    KafkaModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthConsumer, ],
})
export class AppModule {}
