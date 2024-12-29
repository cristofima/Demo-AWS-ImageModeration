import { Controller, Delete, Get, HttpCode, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostService } from '../services/post.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('api/posts')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('image'))
    @HttpCode(201)
    async create(@UploadedFile() file: Express.Multer.File) {
        return await this.postService.create(file);
    }

    @Get()
    async findAll() {
        return this.postService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.postService.findById(id);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        await this.postService.delete(id);
    }
}
