import {Entity, Column, OneToMany, PrimaryColumn} from 'typeorm';
import {OperationsLog} from "./operations-log";

@Entity('accounts')
export class Account {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'uuid' })
  ownerId: string;

  @Column({ type: 'number' })
  balance: number;

  @OneToMany(() => OperationsLog, (log) => log.account)
  logs: OperationsLog[]
}
