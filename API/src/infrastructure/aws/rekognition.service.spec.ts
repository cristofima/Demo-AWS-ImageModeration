import { ConfigService } from '@nestjs/config';
import { Rekognition } from '@aws-sdk/client-rekognition';
import { RekognitionService } from './rekognition.service';

jest.mock('@aws-sdk/client-rekognition');

describe('RekognitionService', () => {
  let rekognitionService: RekognitionService;
  const mockDetectModerationLabels: jest.Mock = jest.fn();

  const configService = {
    get: jest.fn((key: string) => {
      const mockEnv: Record<string, string> = {
        AWS_REKOGNITION_REGION: 'us-east-1',
        AWS_REKOGNITION_ACCESS_KEY: 'mock-access-key',
        AWS_REKOGNITION_SECRET_ACCESS_KEY: 'mock-secret-key',
      };
      return mockEnv[key];
    }),
  } as unknown as ConfigService;

  beforeEach(() => {
    (Rekognition as jest.Mock).mockImplementation(() => ({
      detectModerationLabels: mockDetectModerationLabels,
    }));

    rekognitionService = new RekognitionService(configService);
  });

  it('should detect moderation labels', async () => {
    const imageBuffer = Buffer.from('test');
    const fakeLabels = [{ Name: 'Explicit', Confidence: 99 }];

    mockDetectModerationLabels.mockResolvedValueOnce({
      ModerationLabels: fakeLabels,
    });

    const result = await rekognitionService.detectModerationLabels(imageBuffer);

    expect(result).toEqual(fakeLabels);
    expect(mockDetectModerationLabels).toHaveBeenCalledWith({
      Image: { Bytes: imageBuffer },
    });
  });
});
