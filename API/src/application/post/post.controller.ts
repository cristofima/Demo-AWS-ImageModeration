import {
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { PostModel } from './models/post.model';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';
import { UserModel } from 'src/infrastructure/auth/user.model';

@Controller('api/posts')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiOkResponse({
    description: 'List of all posts.',
    type: PostModel,
    isArray: true,
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Request() req: any,
  ) {
    const userId: string = req.user.userId;
    return this.postService.findAll(Number(page), Number(limit), userId);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Post details.',
    type: PostModel,
  })
  @ApiNotFoundResponse({
    description: 'Post not found.',
  })
  async findById(@Param('id') id: number) {
    return this.postService.findById(id);
  }

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
  @ApiCreatedResponse({
    description: 'Post has been successfully created.',
    type: PostModel,
  })
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() req: any,
  ) {
    const user: UserModel = req.user;
    return await this.postService.create(file, user);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({
    description: 'Post has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'Post not found.',
  })
  async delete(@Param('id') id: number, @Request() req: any) {
    const userId: string = req.user.userId;
    await this.postService.delete(id, userId);
  }
}
