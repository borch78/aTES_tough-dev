import {AssignProcessing} from "./assign-processing";
import {StatusProcessing} from "./status-processing";

export class TaskProcessingFactory {
    create(topic: string) {
        switch (topic) {
            case topic === 'task.waterfall.assign':
                return new AssignProcessing();
            case topic === 'task.waterfall.status':
                return new StatusProcessing();
            default:
                throw new Error(`Unsupported topic: ${topic}`);
        }
    }
}
