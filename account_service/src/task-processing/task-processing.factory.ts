import {AssignProcessing} from "./assign-processing";
import {StatusProcessing} from "./status-processing";
import {CreateProcessing} from "./create-processing";

export class TaskProcessingFactory {
    create(topic: string) {
        switch (topic) {
            case topic === 'v1.task.waterfall.assign':
                return new AssignProcessing();
            case topic === 'v1.task.waterfall.complete':
                return new StatusProcessing();
            case topic === 'v1.task.waterfall.create':
                return new CreateProcessing();
            default:
                throw new Error(`Unsupported topic: ${topic}`);
        }
    }
}
