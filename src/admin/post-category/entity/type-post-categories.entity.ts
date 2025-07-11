// post/entity/list-post-category.entity.ts
import { PostCategory } from 'src/post/entity/post-category.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, BeforeInsert, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class ListPostCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    uuid: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true, type: 'text' })
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => PostCategory, (postCategory) => postCategory.template)
    postCategories: PostCategory[];

    @BeforeInsert()
    generateUUID() {
      this.uuid = uuidv4();
    }
}
