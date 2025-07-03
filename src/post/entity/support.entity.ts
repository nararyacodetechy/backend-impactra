// src/posts/entities/like.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { Post } from './post.entity';
import { User } from 'src/user/entity/user.entity';

@Entity()
@Unique(['post', 'user']) // 1 user hanya bisa like 1 kali
export class Support {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, post => post.supports, { eager: false, onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => User, user => user.supports, { eager: false, onDelete: 'CASCADE' })
  user: User;
}
