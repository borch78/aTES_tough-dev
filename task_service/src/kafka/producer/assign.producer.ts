import {Task, TaskStatus} from "../../entities/task";
import {ProducerService} from "./producer.service";
import {ProducerRecord} from "kafkajs";

export class AssignProducer extends ProducerService {
    constructor() {
        super()
    }

    async assignTasks(tasks: Task[]): Promise<void> {
        const record: ProducerRecord = {
            topic: 'task.waterfall.assign',
            messages: tasks.map((item) => ({
                value: JSON.stringify({
                    id: item.id,
                    executorId: item.id,
                })
            }))
        }
        await this.produce(record)
    }

    async completeTask(task: Task): Promise<void> {
        const record: ProducerRecord = {
            topic: 'task.waterfall.status',
            messages: [{
                value: JSON.stringify({
                    id: task.id,
                    executorId: task.id,
                    status: TaskStatus.Complete,
                })
            }]
        }
        await this.produce(record)
    }
}
