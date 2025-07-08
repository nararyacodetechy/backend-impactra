import { User } from 'src/user/entity/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity('login_sessions')
export class LoginSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.loginSessions, { eager: true })
  user: User;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  ipAddress: string;

  @CreateDateColumn()
  loggedInAt: Date;
}
