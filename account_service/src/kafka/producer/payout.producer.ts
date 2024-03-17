import {Account} from "../../entities/account";
import {ProducerService} from "./producer.service";
import {ProducerRecord} from "kafkajs";
import {MessageJornal} from "../../../../task_service/src/entities/message-jornal";
import {Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class PayoutProducer extends ProducerService {
    constructor(
        @InjectRepository(MessageJornal)
        private messageJornalRepository: Repository<MessageJornal>,
    ) {
        super()
    }

    async payoutProcessing(accounts: Account[]): Promise<void> {
        const message = new MessageJornal()
        try {
            const record: ProducerRecord = {
                topic: 'accounts.payout',
                messages: accounts.map((item) => ({
                    value: JSON.stringify({
                        accountId: item.id,
                        ownerId: item.ownerId,
                        balance: item.balance,
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
}
