import { ModerationLabel } from '@aws-sdk/client-rekognition';
import { getModerationStatus } from './moderation.util';

describe('Moderation Util', () => {
  it('should return APPROVED for safe content', () => {
    const labels: ModerationLabel[] = [];
    const result = getModerationStatus(labels);
    expect(result).toBe('APPROVED');
  });

  it('should return BLURRED for content requiring blurring', () => {
    const labels: ModerationLabel[] = [
      { Name: 'Explicit', Confidence: 60, ParentName: null },
      { Name: 'Explicit Nudity', Confidence: 55, ParentName: 'Explicit' },
      { Name: 'Exposed Female Nipple', Confidence: 58, ParentName: 'Explicit Nudity' },
    ];
    const result = getModerationStatus(labels);
    expect(result).toBe('BLURRED');
  });

  it('should return REJECTED for inappropriate content', () => {
    const labels: ModerationLabel[] = [
      { Name: 'Swimwear or Underwear', Confidence: 99.99, ParentName: null },
      { Name: 'Female Swimwear or Underwear', Confidence: 99, ParentName: 'Swimwear or Underwear' },
    ];
    const result = getModerationStatus(labels);
    expect(result).toBe('REJECTED');
  });
});
