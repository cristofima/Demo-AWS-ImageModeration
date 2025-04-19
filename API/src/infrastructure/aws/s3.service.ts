import { Injectable } from '@nestjs/common';
import { S3, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3: S3;

  constructor(private readonly configService: ConfigService) {
    const s3_region = this.configService.get<string>('AWS_S3_REGION');

    if (!s3_region) {
      throw new Error('AWS_S3_REGION not found in environment variables');
    }

    this.s3 = new S3({
      region: s3_region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>(
          'AWS_S3_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async uploadFile(
    bucket: string,
    key: string,
    body: Buffer,
    contentType: string,
    metadata?: Record<string, string>,
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: 'max-age=21600',
      Metadata: metadata,
    });
    await this.s3.send(command);
  }

  async deleteFile(bucket: string, key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    await this.s3.send(command);
  }
}
