import {Entity, Column, PrimaryColumn} from 'typeorm';

@Entity('message_jornal')
export class MessageJornal {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'jsonb', nullable: true })
  message?: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date = new Date();

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date = new Date();

  @Column({ type: 'boolean', default: false })
  isSend: boolean = false;
}
