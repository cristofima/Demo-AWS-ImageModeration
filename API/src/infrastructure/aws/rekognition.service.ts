import { Injectable } from '@nestjs/common';
import { Rekognition } from '@aws-sdk/client-rekognition';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RekognitionService {
  private readonly rekognition: Rekognition;

  constructor(private readonly configService: ConfigService) {
    const s3_region = this.configService.get<string>('AWS_REKOGNITION_REGION');

    if (!s3_region) {
      throw new Error(
        'AWS_REKOGNITION_REGION not found in environment variables',
      );
    }

    this.rekognition = new Rekognition({
      region: s3_region,
      credentials: {
        accessKeyId: this.configService.get<string>(
          'AWS_REKOGNITION_ACCESS_KEY',
        ),
        secretAccessKey: this.configService.get<string>(
          'AWS_REKOGNITION_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async detectModerationLabels(imageBuffer: Buffer) {
    const response = await this.rekognition.detectModerationLabels({
      Image: { Bytes: imageBuffer },
    });
    return response.ModerationLabels || [];
  }
}
