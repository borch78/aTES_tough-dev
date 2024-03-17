import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Account} from "../entities/account";
import {Repository} from "typeorm";
import {OperationsLog} from "../entities/operations-log";
import {TaskCost} from "../entities/task-cost";

@Injectable()
export class StatusProcessing {
    constructor(
        @InjectRepository(Account)
        private accountsRepository: Repository<Account>,
        @InjectRepository(TaskCost)
        private taskCostRepository: Repository<TaskCost>,
        @InjectRepository(OperationsLog)
        private logsRepository: Repository<OperationsLog>,
    ) {}

    async execute(message) {
        const account = await this.accountsRepository.findOne({ where: { ownerId: message.executorId } });
        account.balance = account.balance + (Math.random() * (40 - 20) + 20);
        await this.accountsRepository.save(account);
        await this.taskCostRepository.update(message.taskId, { isDone: true } )

        await this.makeCompleteLog(account.id, message.taskId);
    }

    private async makeCompleteLog(accountId: string, taskId: string) {
        const log = new OperationsLog();
        log.accountId = accountId;
        log.message = JSON.stringify({
            description: 'Задача выполнена сотрудником',
            taskId,
        })
        await this.logsRepository.save(log)
    }
}
