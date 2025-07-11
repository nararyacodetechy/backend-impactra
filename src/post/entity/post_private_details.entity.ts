// src/posts/entity/post-private-details.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class PostPrivateDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn()
  post: Post;

  @Column({ type: 'text', nullable: true })
  idea_details: string;

  @Column({ type: 'text', nullable: true })
  internal_notes: string;

  @CreateDateColumn()
  proof_timestamp: Date;
}
