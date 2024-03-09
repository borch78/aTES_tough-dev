import { Injectable } from '@nestjs/common';
import {Account} from "./entities/account";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {OperationsLog} from "./entities/operations-log";

@Injectable()
export class AppService {
  constructor(
      @InjectRepository(Account)
      private accountsRepository: Repository<Account>,
      @InjectRepository(OperationsLog)
      private logsRepository: Repository<OperationsLog>,
  ) {
  }
  getAccount(ownerId: string) {
    return this.accountsRepository.findOne({ where: { ownerId } });
  }
  async getLogs(ownerId: string) {
    const account = await this.accountsRepository.findOne({ where: { ownerId } });
    return account?.logs ?? [];
  }
}
