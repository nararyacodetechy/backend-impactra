// src/post/entity/post-category.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from './post.entity';
import { User } from 'src/user/entity/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { ListPostCategory } from 'src/admin/post-category/entity/type-post-categories.entity';

@Entity()
export class PostCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uuid: string;

  @BeforeInsert()
  generateUUID() {
    this.uuid = uuidv4();
  }

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image_url: string | null; // Tambahkan kolom image_url

  @Column({ type: 'enum', enum: ['full_public', 'partial_public', 'private'], default: 'full_public' })
  visibility_mode: 'full_public' | 'partial_public' | 'private'; // Tambahkan visibility_mode

  @Column({ type: 'text', nullable: true })
  idea_details: string | null; // Tambahkan idea_details

  @Column({ type: 'text', nullable: true })
  internal_notes: string | null; // Tambahkan internal_notes

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];

  @ManyToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  author: User;

  @ManyToOne(() => ListPostCategory, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'template_id' })
  template: ListPostCategory;

  @CreateDateColumn()
  created_at: Date;
}