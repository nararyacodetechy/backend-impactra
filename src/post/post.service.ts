import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from './entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PostCategory } from './entity/post-category.entity';
import { PostPrivateDetails } from './entity/post_private_details.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private postRepo: Repository<Post>,
      
        @InjectRepository(User)
        private userRepo: Repository<User>,

        @InjectRepository(PostCategory)
        private categoryRepo: Repository<PostCategory>,

        @InjectRepository(PostPrivateDetails)
        private privateDetailRepo: Repository<PostPrivateDetails>,
      ) {}   

      async createPost(dto: CreatePostDto, user: any) {
        const author = await this.userRepo.findOneBy({ id: user.id });
        if (!author) throw new NotFoundException('User not found');
      
        const category = await this.categoryRepo.findOneBy({ id: dto.category_id });
        if (!category) throw new NotFoundException('Category not found');
      
        const post = this.postRepo.create({
          title: dto.title,
          content: dto.content,
          image_url: dto.image_url,
          is_public: dto.is_public ?? true,
          visibility_mode: dto.visibility_mode ?? 'full_public',
          category,
          author,
        });
      
        const savedPost = await this.postRepo.save(post);
      
        // If private details exist, save them
        if (dto.idea_details || dto.internal_notes) {
          const privateDetails = this.privateDetailRepo.create({
            post: savedPost,
            idea_details: dto.idea_details,
            internal_notes: dto.internal_notes,
          });
          await this.privateDetailRepo.save(privateDetails);
        }
      
        return savedPost;
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

    async getPostByUUID(uuid: string) {
      const post = await this.postRepo.findOne({
        where: { uuid },
        relations: ['author', 'comments', 'supports', 'privateDetails'],
      });
    
      if (!post) throw new NotFoundException('Post not found');
    
      return post;
    }
}
