import {Task} from "../../entities/task";
import {ProducerService} from "./producer.service";
import {ProducerRecord} from "kafkajs";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {MessageJornal} from "../../entities/message-jornal";

@Injectable()
export class TaskProducer extends ProducerService {
    constructor(
        @InjectRepository(MessageJornal)
        private messageJornalRepository: Repository<MessageJornal>,
    ) {
        super()
    }

    async assignTasks(tasks: Task[]): Promise<void> {
        const message = new MessageJornal()
        try {
            const record: ProducerRecord = {
                topic: 'v1.task.waterfall.assign',
                messages: tasks.map((item) => ({
                    value: JSON.stringify({
                        taskId: item.id,
                        executorId: item.executorId,
                    })
                }))
            }

            message.message = JSON.stringify(record)
            await this.produce(record)
            message.isSend = true;
        } catch (e) {
            console.log('Error during send message', e)
        } finally {
            this.messageJornalRepository.save(message)
        }
    }

    async createTask(task: Task): Promise<void> {
        const message = new MessageJornal()
        try {
            const record: ProducerRecord = {
                topic: 'v1.task.waterfall.create',
                messages: [{
                    value: JSON.stringify({
                        taskId: task.id,
                        executorId: task.executorId,
                    })
                }]
            }

            message.message = JSON.stringify(record)
            await this.produce(record)
            message.isSend = true;
        } catch (e) {
            console.log('Error during send message', e)
        } finally {
            this.messageJornalRepository.save(message)
        }
    }

    async completeTask(task: Task): Promise<void> {
        const message = new MessageJornal()
        try {
            const record: ProducerRecord = {
                topic: 'v1.task.waterfall.complete',
                messages: [{
                    value: JSON.stringify({
                        taskId: task.id,
                        executorId: task.executorId,
                    })
                }]
            }
            await this.produce(record)

            message.message = JSON.stringify(record)
            await this.produce(record)
            message.isSend = true;
        } catch (e) {
            console.log('Error during send message', e)
        } finally {
            this.messageJornalRepository.save(message)
        }
    }
}
