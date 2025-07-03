import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { CommentDto } from "./dto/comment.dto";
import { Body, Controller, Delete, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudService } from "src/cloud/cloud.service";

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController {
    constructor(private postService: PostService) {}

    @Post()
    async create(
        @Body() dto: CreatePostDto,
        @Req() req,
    ) {
        console.log('Incoming DTO:', dto);  // DTO akan punya: content + image_url
        return this.postService.createPost(dto, req.user);
    }

    @Get()
    getAll() {
        return this.postService.getAllPosts();
    }

    @Post(':id/comment')
    comment(@Param('id') id: number, @Body() dto: CommentDto, @Req() req) {
        return this.postService.addComment(id, dto, req.user);
    }

    @Post(':id/support')
    @UseGuards(JwtAuthGuard)
    support(@Param('id') postId: number, @Req() req: any) {
    return this.postService.supportPost(postId, req.user);
    }

    @Delete(':id/support')
    @UseGuards(JwtAuthGuard)
    unsupport(@Param('id') postId: number, @Req() req: any) {
    return this.postService.unsupportPost(postId, req.user);
    }

}
