import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Account} from "../entities/account";
import {Repository} from "typeorm";
import {OperationsLog} from "../entities/operations-log";
import {TaskCost} from "../entities/task-cost";

@Injectable
export class AssignProcessing {
    constructor(
        @InjectRepository(Account)
        private accountsRepository: Repository<Account>,
        @InjectRepository(TaskCost)
        private taskCostRepository: Repository<TaskCost>,
        @InjectRepository(OperationsLog)
        private logsRepository: Repository<OperationsLog>,
    ) {}

    async execute(message) {
        let taskCost = await this.taskCostRepository.findOne({ where: { taskId: message.id } });
        if (!taskCost) {
            taskCost = new TaskCost();
            taskCost.taskId = message.taskId;
            taskCost.cost = Math.random() * (20 - 10) + 10;
            await this.taskCostRepository.save(taskCost)
        }
        const account = await this.accountsRepository.findOne({ where: { ownerId: message.executorId } });
        account.balance = account.balance - taskCost.cost;
        await this.accountsRepository.save(account);

        await this.makeAssignLog(account.id, message.taskId);
    }

    private async makeAssignLog(accountId: string, taskId: string) {
        const log = new OperationsLog();
        log.accountId = accountId;
        log.message = JSON.stringify({
            description: 'Задача назначена на сотрудника',
            taskId,
        })
        await this.logsRepository.save(log)
    }
}
