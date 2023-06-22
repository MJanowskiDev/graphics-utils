import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { OperationType } from '../types';
import { Asset, OperationData } from './';

@Entity()
export class ImageProcessing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: OperationType })
  type: OperationType;

  @OneToOne(() => Asset)
  @JoinColumn()
  assetsId: number;

  @OneToOne(() => OperationData)
  @JoinColumn()
  operationDataId: number;

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
