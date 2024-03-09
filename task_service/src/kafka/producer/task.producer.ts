import {Task, TaskStatus} from "../../entities/task";
import {ProducerService} from "./producer.service";
import {ProducerRecord} from "kafkajs";

export class TaskProducer extends ProducerService {
    constructor() {
        super()
    }

    async assignTasks(tasks: Task[]): Promise<void> {
        const record: ProducerRecord = {
            topic: 'task.waterfall.assign',
            messages: tasks.map((item) => ({
                value: JSON.stringify({
                    taskId: item.id,
                    executorId: item.executorId,
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
                    taskId: task.id,
                    executorId: task.executorId,
                })
            }]
        }
        await this.produce(record)
    }
}
