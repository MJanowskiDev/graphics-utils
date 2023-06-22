import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OperationType } from '../types';

@Entity()
export class OperationData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: OperationType })
  type: OperationType;

  @Column({ nullable: true, type: 'json' })
  userParams: string;

  @Column({ nullable: true, type: 'json' })
  inputDescription: string;

  @Column({ nullable: true, type: 'json' })
  outputDescription: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
