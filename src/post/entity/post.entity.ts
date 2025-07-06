// src/posts/entities/post.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany, Generated, BeforeInsert } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { Support } from './support.entity';
import { Comment } from './comment.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uuid: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image_url: string | null;

  @ManyToOne(() => User, user => user.posts, { eager: true })
  author: User;

  @OneToMany(() => Comment, comment => comment.post, { cascade: true })
  comments: Comment[];

  @OneToMany(() => Support, support => support.post)
  supports: Support[];

  @CreateDateColumn()
  created_at: Date;

  @BeforeInsert()
  generateUUID() {
    this.uuid = uuidv4();
  }
}
