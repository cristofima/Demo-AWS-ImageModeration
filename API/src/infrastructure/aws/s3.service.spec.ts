import { ConfigService } from '@nestjs/config';
import { S3, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { S3Service } from './s3.service';

jest.mock('@aws-sdk/client-s3');

describe('S3Service', () => {
  let s3Service: S3Service;
  const configService = {
    get: jest.fn((key: string) => {
      const mockEnv: Record<string, string> = {
        AWS_S3_REGION: 'us-east-1',
        AWS_S3_ACCESS_KEY: 'mock-access-key',
        AWS_S3_SECRET_ACCESS_KEY: 'mock-secret-key',
      };
      return mockEnv[key];
    }),
  } as unknown as ConfigService;

  beforeEach(() => {
    s3Service = new S3Service(configService);
  });

  it('should upload a file to S3', async () => {
    const bucket = 'test-bucket';
    const key = 'test-key';
    const body = Buffer.from('test');
    const contentType = 'image/jpeg';
    const metadata = { test: 'metadata' };

    await s3Service.uploadFile(bucket, key, body, contentType, metadata);

    expect(S3.prototype.send).toHaveBeenCalledWith(
      expect.any(PutObjectCommand),
    );
  });

  it('should delete a file from S3', async () => {
    const bucket = 'test-bucket';
    const key = 'test-key';

    await s3Service.deleteFile(bucket, key);

    expect(S3.prototype.send).toHaveBeenCalledWith(
      expect.any(DeleteObjectCommand),
    );
  });
});
