import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { CommentDto } from './dto/comment.dto';
import { Repository } from 'typeorm';
import { Support } from './entity/support.entity';
import { Post } from './entity/post.entity';
import { Comment } from './entity/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private postRepo: Repository<Post>,
      
        @InjectRepository(Comment)
        private commentRepo: Repository<Comment>,
      
        @InjectRepository(Support)
        private supportRepo: Repository<Support>,

        @InjectRepository(User)
        private userRepo: Repository<User>,
      ) {}   

    async createPost(dto: CreatePostDto, user: any) {
    const author = await this.userRepo.findOneBy({ id: user.id });
    if (!author) throw new NotFoundException('User not found');
    
    const post = this.postRepo.create({
        content: dto.content,
        image_url: dto.image_url,
        author,
    });
    
    return await this.postRepo.save(post);
    }
    
    async getAllFeeds() {
        return this.postRepo.find({
        order: { created_at: 'DESC' },
        relations: ['author', 'comments', 'supports'],
        });
    }

    async getPostsByUser(userId: number) {
        const user = await this.userRepo.findOne({
          where: { id: userId },
          relations: ['posts', 'posts.comments', 'posts.supports'],
        });
      
        if (!user) {
          throw new NotFoundException('User not found');
        }
      
        return user.posts.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    }
    
    async addComment(postId: number, dto: CommentDto, user: User) {
        const post = await this.postRepo.findOneBy({ id: postId });
        if (!post) throw new NotFoundException('Post not found');
    
        const comment = this.commentRepo.create({ ...dto, post, user });
        return this.commentRepo.save(comment);
    }
    
    async supportPost(postId: number, user: User) {
        const post = await this.postRepo.findOneBy({ id: postId });
        if (!post) throw new NotFoundException('Post not found');
        
        const existingSupport = await this.supportRepo.findOne({
            where: { post: { id: postId }, user: { id: user.id } },
        });
        
        if (existingSupport) return existingSupport;
        
        const support = this.supportRepo.create({ post, user });
            
        return this.supportRepo.save(support);
    }
    
    async unsupportPost(postId: number, user: User) {
        const support = await this.supportRepo.findOne({
            where: { post: { id: postId }, user: { id: user.id } },
        });
        
        if (!support) throw new NotFoundException('Support not found');
        
        return this.supportRepo.remove(support);
    }

    async getPostByUUID(uuid: string) {
    const post = await this.postRepo.findOne({
        where: { uuid },
        relations: ['author', 'comments', 'supports'],
    });
    
    if (!post) throw new NotFoundException('Post not found');
    
    return post;
    }
}
