import {Entity, Column, PrimaryColumn, ManyToOne} from 'typeorm';
import {Account} from "./account";

@Entity('operations_log')
export class OperationsLog {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'uuid' })
  accountId: string;

  @Column({ type: 'jsonb' })
  message: string;

  @Column({ type: 'uuid' })
  createdAt: Date = new Date();

  @ManyToOne(() => Account, (account) => account.id)
  account: Account[];
}
