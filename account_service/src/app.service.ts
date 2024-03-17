import { Injectable } from '@nestjs/common';
import {Account} from "./entities/account";
import {Repository, MoreThan, LessThan} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {OperationsLog} from "./entities/operations-log";
import {PayoutProducer} from "./kafka/producer/payout.producer";
import {TaskCost} from "./entities/task-cost";

@Injectable()
export class AppService {
  constructor(
      @InjectRepository(Account)
      private accountsRepository: Repository<Account>,
      @InjectRepository(OperationsLog)
      private logsRepository: Repository<OperationsLog>,
      @InjectRepository(TaskCost)
      private taskCostRepository: Repository<TaskCost>,
      private readonly payoutProducer: PayoutProducer
  ) {
  }
  getAccount(ownerId: string) {
    return this.accountsRepository.findOne({ where: { ownerId } });
  }
  async getLogs(ownerId: string) {
    const account = await this.accountsRepository.findOne({ where: { ownerId } });
    return account?.logs ?? [];
  }

  async getAnalytic() {
    const todayTasks = await this.taskCostRepository.find({
      where: {
        createdAt: Date.now().toString()
      }
    })
    let assignedTaskSum = 0;
    let completedTaskSum = 0;
    for (const task of todayTasks) {
      if (task.isDone) {
        completedTaskSum = completedTaskSum + task.cost;
        continue;
      }
      assignedTaskSum = assignedTaskSum + task.cost;
    }
    const countNegativeBalancePopug = await this.accountsRepository.count({ where: { balance: LessThan(0) } })
    return {
      income: assignedTaskSum - completedTaskSum,
      countNegativeBalancePopug
    }
  }

  @Cron('* * 23 * * *')
  async closeDay() {
    const accounts = await this.accountsRepository.findBy({
      balance: MoreThan(0)
    })
    if (!accounts.length) {
      console.log('no data for payout')
    }
    await this.payoutProducer.payoutProcessing(accounts);
    for (const item of accounts) {
      const log = new OperationsLog()
      log.accountId = item.id;
      log.message = JSON.stringify({
        description: 'Произведена выплата по окончании дня',
        balance: item.balance,
      })
      item.balance = 0
    }
    await this.accountsRepository.save(accounts);
  }
}
