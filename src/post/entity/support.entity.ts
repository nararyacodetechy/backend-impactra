import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { Post } from './post.entity';

@Entity()
export class Support {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, post => post.supports, { onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => User, user => user.supports, { onDelete: 'CASCADE' })
  user: User;

  @Column({ default: 'like' })
  type: string; // bisa kamu ubah jadi enum jika ingin

  @CreateDateColumn()
  created_at: Date;
}
