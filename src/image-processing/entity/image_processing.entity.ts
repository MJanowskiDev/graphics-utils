import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { OperationType } from '../types/operations';

@Entity()
export class ImageProcessing {
  // @OneToOne(() => Asset)
  // @JoinColumn()
  // assetsId: number;

  // @OneToOne(() => OperationData)
  // @JoinColumn()
  // operationDataId: number;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: OperationType })
  type: OperationType;

  @Column({ nullable: true })
  outputLink: string;

  @Column({ nullable: true, type: 'json' })
  userParams: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
