import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from 'src/domain/entities/post.entity';
import { S3Service } from '../../infrastructure/aws/s3.service';
import { RekognitionService } from '../../infrastructure/aws/rekognition.service';
import { getModerationStatus } from 'src/shared/utils/moderation.util';
import { mapToPostModel } from 'src/application/post/mapper/post.mapper';
import { UserModel } from 'src/infrastructure/auth/user.model';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly s3Service: S3Service,
    private readonly rekognitionService: RekognitionService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(page: number, limit: number, userId: string) {
    const posts = await this.postRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      select: ['id', 'imagePath', 'imageIsBlurred', 'createdAt', 'createdBy'],
      order: { createdAt: 'DESC' },
      where: { userId: userId },
    });

    const total = await this.postRepository.count({
      where: { userId: userId },
    });
    const totalPages = Math.ceil(total / limit);

    return {
      data: posts.map(mapToPostModel),
      metadata: {
        page: page,
        limit: limit,
        totalRecords: total,
        totalPages: totalPages,
      },
    };
  }

  async findById(id: number) {
    const post = await this.findPostById(id);
    return mapToPostModel(post);
  }

  async delete(id: number, userId: string): Promise<void> {
    const post = await this.findPostById(id);

    if (post.userId !== userId) {
      throw new BadRequestException(
        'You are not authorized to delete this post',
      );
    }

    await this.s3Service.deleteFile(
      this.configService.get<string>('AWS_S3_BUCKET_NAME'),
      post.imagePath,
    );
    await this.postRepository.delete({ id });
  }

  async create(file: Express.Multer.File, user: UserModel) {
    const uuid = uuidv4();
    const folder = this.configService.get<string>('AWS_S3_BUCKET_FOLDER');
    const bucket = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const fileExtension = file.originalname.split('.').pop();
    const imagePath = `${folder}/${uuid}.${fileExtension}`;

    await this.s3Service.uploadFile(
      bucket,
      imagePath,
      file.buffer,
      file.mimetype,
      {
        userName: user.nickname,
      },
    );

    const moderationLabels =
      await this.rekognitionService.detectModerationLabels(file.buffer);
    const status = getModerationStatus(moderationLabels);

    if (status === 'REJECTED') {
      await this.s3Service.deleteFile(bucket, imagePath);
      throw new BadRequestException('Image rejected');
    }

    const post: Partial<Post> = {
      imagePath,
      imageIsBlurred: status === 'BLURRED',
      moderationLabels,
      createdAt: new Date(),
      userId: user.userId,
      createdBy: user.nickname,
    };

    this.postRepository.create(post);
    await this.postRepository.save(post);

    return mapToPostModel(post);
  }

  private async findPostById(id: number): Promise<Post> {
    const post = await this.postRepository.findOneById(id);
    if (!post) {
      throw new BadRequestException('Post not found');
    }
    return post;
  }
}
