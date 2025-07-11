// src/posts/entity/post.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  CreateDateColumn, OneToMany, Generated, BeforeInsert,
  JoinColumn,
  OneToOne
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/user/entity/user.entity';
import { PostCategory } from './post-category.entity';
import { Support } from './support.entity';
import { Comment } from './comment.entity';
import { PostPrivateDetails } from './post_private_details.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uuid: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image_url: string | null;

  @Column({ default: true })
  is_public: boolean;

  @Column({ type: 'enum', enum: ['full_public', 'partial_public', 'private'], default: 'full_public' })
  visibility_mode: 'full_public' | 'partial_public' | 'private';

  @ManyToOne(() => PostCategory, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: PostCategory;


  @ManyToOne(() => User, user => user.posts, { eager: true })
  author: User;

  @OneToOne(() => PostPrivateDetails, privateDetail => privateDetail.post, {
    cascade: true,
  })
  privateDetails: PostPrivateDetails;

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
