import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { PostCategory } from "./entity/post-category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Controller('posts')
export class PostController {
    constructor(
        private postService: PostService,
    
        @InjectRepository(PostCategory)
        private readonly postCategoryRepo: Repository<PostCategory>, // ✅ tambahkan ini
    ) {}
    
    @Post()
    @UseGuards(JwtAuthGuard)
    async create(
        @Body() dto: CreatePostDto,
        @Req() req,
    ) {
        return this.postService.createPost(dto, req.user);
    }

    @Get()
    getAllPosts() {
        return this.postService.getAllFeeds();
    }

    @Get('uuid/:uuid')
    getPostByUUID(@Param('uuid') uuid: string) {
    return this.postService.getPostByUUID(uuid);
    }
}
