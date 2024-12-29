import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as AWS from 'aws-sdk';
import { Model } from 'mongoose';
import { PostModel } from 'src/models/post.model';
import { Post } from 'src/schemas/post.schema';
import { ModerationUtil } from 'src/utils/moderation.util';
import { PostUtil } from 'src/utils/post.util';
import { v4 as uuidv4 } from 'uuid';

export interface ModerationResult {
    status: 'APPROVED' | 'BLURRED' | 'REJECTED';
    labels: string[];
}

@Injectable()
export class PostService {
    private rekognition: AWS.Rekognition;
    private s3: AWS.S3;

    constructor(@InjectModel(Post.name) private postModel: Model<Post>) {
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

    async findAll(): Promise<PostModel[]> {
        return (await this.postModel.find().sort({ createdAt: 'desc' }).exec()).map(post => {
            return PostUtil.mapToPostModel(post);
        });
    }

    async findById(id: string) {
        const post = await this.postModel.findById(id);
        if (!post) throw new BadRequestException({
            message: 'Post not found'
        });

        return PostUtil.mapToPostModel(post);
    }

    async delete(id: string): Promise<void> {
        const post = await this.postModel.findById(id);
        if (!post) throw new BadRequestException({
            message: 'Post not found'
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
        await this.postModel.deleteOne({ _id: id });
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
                /*Metadata: {
                    'Cache-Control': 'max-age=21600',
                    'Content-Type': file.mimetype,
                    'ACL': 'public-read',
                }*/
            })
            .promise();

        // Rekognition
        const moderationResult = await this.rekognition
            .detectModerationLabels({ Image: { Bytes: file.buffer } })
            .promise();

        const status = ModerationUtil.getModerationStatus(moderationResult.ModerationLabels);

        if (status === 'REJECTED') {
            await this.s3
                .deleteObject({
                    Bucket: bucketName,
                    Key: imagePath,
                })
                .promise();

            throw new BadRequestException({
                message: 'Image rejected',
            });
        }

        const imageIsBlurred = status === 'BLURRED';
        const post = new this.postModel({ uuid, imagePath, moderationLabels: moderationResult.ModerationLabels, imageIsBlurred });
        await post.save();

        return PostUtil.mapToPostModel(post);
    }
}
