import { ModerationLabel } from '@aws-sdk/client-rekognition';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'Posts' })
export class Post {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'ImagePath' })
  imagePath: string;

  @Column({ name: 'ImageIsBlurred', default: false })
  imageIsBlurred: boolean;

  @Column('json', { name: 'ModerationLabels', default: {} })
  moderationLabels: ModerationLabel[];

  @Column({ name: 'UserId' })
  userId: string;

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'CreatedBy' })
  createdBy: string;
}
