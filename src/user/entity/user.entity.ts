import { Post } from 'src/post/entity/post.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { LoginSession } from 'src/auth/entity/login-session.entity';
import { Support } from 'src/post/entity/support.entity';
import { Comment } from 'src/post/entity/comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uuid: string = uuidv4();

  @OneToMany(() => LoginSession, session => session.user)
  loginSessions: LoginSession[];

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  full_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  username: string;

  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'enum', enum: ['user', 'admin', 'verifier'], default: 'user' })
  role: 'user' | 'admin' | 'verifier';

  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @OneToMany(() => Support, support => support.user)
  supports: Support[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  password_reset_token: string | null;

  @Column({ type: 'datetime', nullable: true })
  password_reset_expires: Date | null;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ default: false })
  has_password: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
