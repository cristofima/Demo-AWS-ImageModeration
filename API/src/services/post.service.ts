import { BadRequestException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { Post } from 'src/entities/post.entity';
import { ModerationUtil } from 'src/utils/moderation.util';
import { PostUtil } from 'src/utils/post.util';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export interface ModerationResult {
  status: 'APPROVED' | 'BLURRED' | 'REJECTED';
  labels: string[];
}

@Injectable()
export class PostService {
  private rekognition: AWS.Rekognition;
  private s3: AWS.S3;

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {
    this.s3 = new AWS.S3({
      region: process.env.AWS_S3_REGION,
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    });

    this.rekognition = new AWS.Rekognition({
      region: process.env.AWS_REKOGNITION_REGION,
      accessKeyId: process.env.AWS_REKOGNITION_ACCESS_KEY,
      secretAccessKey: process.env.AWS_REKOGNITION_SECRET_ACCESS_KEY,
    });
  }

  async findAll(page: number, limit: number) {
    const posts = await this.postRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const total = await this.postRepository.count();
    const totalPages = Math.ceil(total / limit);

    return {
      data: posts.map(PostUtil.mapToPostModel),
      metadata:{
        page: page,
        limit: limit,
        totalRecords: total,
        totalPages: totalPages,
      }
    };
  }

  async findById(id: number) {
    const post = await this.postRepository.findOneById(id);
    if (!post)
      throw new BadRequestException({
        statusCode: 400,
        message: 'Post not found',
      });

    return PostUtil.mapToPostModel(post);
  }

  async delete(id: number): Promise<void> {
    const post = await this.postRepository.findOneById(id);
    if (!post)
      throw new BadRequestException({
        statusCode: 400,
        message: 'Post not found',
      });

    // Delete from S3
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    await this.s3
      .deleteObject({
        Bucket: bucketName,
        Key: post.imagePath,
      })
      .promise();

    // Delete from MongoDB
    await this.postRepository.delete({ id: id });
  }

  async create(file: Express.Multer.File) {
    const uuid = uuidv4();
    const folder = process.env.AWS_S3_BUCKET_FOLDER;
    const fileExtension = file.originalname.split('.').pop();
    const imagePath = `${folder}/${uuid}.${fileExtension}`;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    // Upload to S3
    await this.s3
      .upload({
        Bucket: bucketName,
        Key: imagePath,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: 'max-age=21600',
      })
      .promise();

    // Rekognition
    const moderationResult = await this.rekognition
      .detectModerationLabels({ Image: { Bytes: file.buffer } })
      .promise();

    const status = ModerationUtil.getModerationStatus(
      moderationResult.ModerationLabels,
    );

    if (status === 'REJECTED') {
      await this.s3
        .deleteObject({
          Bucket: bucketName,
          Key: imagePath,
        })
        .promise();

      throw new BadRequestException({
        statusCode: 400,
        message: 'Image rejected',
      });
    }

    const imageIsBlurred = status === 'BLURRED';
    let post: Partial<Post> = {
      imagePath: imagePath,
      imageIsBlurred: imageIsBlurred,
      moderationLabels: moderationResult.ModerationLabels,
      createdAt: new Date(),
    };

    this.postRepository.create(post);
    await this.postRepository.save(post);

    return PostUtil.mapToPostModel(post);
  }
}
