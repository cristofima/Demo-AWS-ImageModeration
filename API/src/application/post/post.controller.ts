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
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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
import { MAX_FILE_SIZE, MAX_FILES_COUNT } from 'src/domain/constants/file.constant';
import {
  validateNotEmptyFile,
  validateImageMagicNumber,
} from 'src/shared/utils/file-validation.util';

@Controller('api/posts')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Get()
  @ApiOkResponse({
    description: 'List of all posts.',
    type: PostModel,
    isArray: true,
  })
  async findAll(
    @Request() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
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
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
        fileIsRequired: true,
      }),
    )
    image: Express.Multer.File,
    @Request() req: any,
  ) {
    validateNotEmptyFile(image);
    validateImageMagicNumber(image.buffer);

    const user: UserModel = req.user;
    return await this.postService.create(image, user);
  }

  @Post('batch')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('images', MAX_FILES_COUNT))
  @HttpCode(201)
  @ApiCreatedResponse({
    description: 'Batch upload results.',
  })
  async createBatch(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
        fileIsRequired: true,
      }),
    )
    images: Express.Multer.File[],
    @Request() req: any,
  ) {
    // Validate each file
    images.forEach((image) => {
      validateNotEmptyFile(image);
      validateImageMagicNumber(image.buffer);
    });

    const user: UserModel = req.user;
    return await this.postService.createBatch(images, user);
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
