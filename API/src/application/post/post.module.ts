import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { RekognitionService } from 'src/infrastructure/aws/rekognition.service';
import { S3Service } from 'src/infrastructure/aws/s3.service';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/domain/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostController],
  providers: [PostService, S3Service, RekognitionService],
})
export class PostModule {}
