import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { InjectRepository } from '@nestjs/typeorm';
import { OperationsLog } from '../../entities/operations-log';
import { Repository } from 'typeorm';
import {Account} from "../../entities/account";

@Injectable()
export class UserConsumer implements OnModuleInit {
  constructor(
      private readonly consumerService: ConsumerService,
      @InjectRepository(Account)
      private accountsRepository: Repository<Account>,
      @InjectRepository(OperationsLog)
      private logsRepository: Repository<OperationsLog>,
  ) {}

  async onModuleInit(){
    await this.consumerService.consume(
        { topics: ['user.signup'] },
        {
          eachMessage: async ({ topic, partition, message }) => {
            console.log({
              value: message.value.toString(),
              topic: topic.toString(),
              partition: partition.toString(),
            });
            // todo save new executor id and role
            const eventData = JSON.parse(message.value.toString());
            const account = new Account()
            account.ownerId = eventData?.extendedUser?.id;
            account.balance = 0;
            const savedAccount = await this.accountsRepository.save(account)

            const log = new OperationsLog();
            log.accountId = savedAccount.id
            log.message = JSON.stringify({
                description: 'Создан аккаунт новому сотруднику'
            })
            await this.logsRepository.save(log)
          },
        },
    );
  }
}
