import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from 'src/domain/entities/post.entity';
import { Repository } from 'typeorm';
import { S3Service } from '../../infrastructure/aws/s3.service';
import { RekognitionService } from '../../infrastructure/aws/rekognition.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { UserModel } from 'src/infrastructure/auth/user.model';

const mockPostRepository = () => ({
  find: jest.fn(),
  count: jest.fn(),
  findOneById: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockS3Service = {
  uploadFile: jest.fn(),
  deleteFile: jest.fn(),
};

const mockRekognitionService = {
  detectModerationLabels: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    const config = {
      AWS_S3_BUCKET_NAME: 'test-bucket',
      AWS_S3_BUCKET_FOLDER: 'posts',
    };
    return config[key];
  }),
};

describe('PostService', () => {
  let service: PostService;
  let postRepository: jest.Mocked<Repository<Post>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: getRepositoryToken(Post), useFactory: mockPostRepository },
        { provide: S3Service, useValue: mockS3Service },
        { provide: RekognitionService, useValue: mockRekognitionService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    postRepository = module.get(getRepositoryToken(Post));
  });

  describe('findAll', () => {
    it('should return paginated posts', async () => {
      postRepository.find.mockResolvedValueOnce([{ id: 1 } as Post]);
      postRepository.count.mockResolvedValueOnce(1);

      const result = await service.findAll(1, 10, 'user123');

      expect(postRepository.find).toHaveBeenCalled();
      expect(postRepository.count).toHaveBeenCalled();
      expect(result.data.length).toBe(1);
      expect(result.metadata.totalPages).toBe(1);
    });
  });

  describe('findById', () => {
    it('should return a post model', async () => {
      postRepository.findOneById.mockResolvedValue({ id: 1 } as Post);
      const result = await service.findById(1);

      expect(result.id).toBe(1);
    });

    it('should throw if post not found', async () => {
      postRepository.findOneById.mockResolvedValue(null);
      await expect(service.findById(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should delete post if authorized', async () => {
      const post = { id: 1, userId: 'user123', imagePath: 'img.jpg' } as Post;
      postRepository.findOneById.mockResolvedValueOnce(post);

      await service.delete(1, 'user123');

      expect(mockS3Service.deleteFile).toHaveBeenCalledWith(
        'test-bucket',
        'img.jpg',
      );
      expect(postRepository.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw if unauthorized', async () => {
      const post = { id: 1, userId: 'otherUser' } as Post;
      postRepository.findOneById.mockResolvedValueOnce(post);

      await expect(service.delete(1, 'user123')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('create', () => {
    const mockFile = {
      originalname: 'image.jpg',
      buffer: Buffer.from('fake-image'),
      mimetype: 'image/jpg',
    } as Express.Multer.File;

    const user: UserModel = {
      userId: 'user123',
      nickname: 'John',
      email: '',
    };

    it('should upload image and create post', async () => {
      mockRekognitionService.detectModerationLabels.mockResolvedValueOnce([]);
      const createSpy = jest.spyOn(postRepository, 'create');
      const saveSpy = jest
        .spyOn(postRepository, 'save')
        .mockResolvedValueOnce({} as unknown as Post);

      const result = await service.create(mockFile, user);

      expect(mockS3Service.uploadFile).toHaveBeenCalled();
      expect(mockRekognitionService.detectModerationLabels).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalled();
      expect(saveSpy).toHaveBeenCalled();
      expect(result.imageIsBlurred).toBeFalsy();
      expect(result.createdAt).toBeDefined();
      expect(result.createdBy).toBe(user.nickname);
      expect(result.imagePath).toBeDefined();
    });

    it('should reject image if moderation status is REJECTED', async () => {
      mockRekognitionService.detectModerationLabels.mockResolvedValueOnce([
        { Name: 'Explicit Nudity', Confidence: 99 },
      ]);
      jest
        .spyOn(
          require('src/shared/utils/moderation.util'),
          'getModerationStatus',
        )
        .mockReturnValue('REJECTED');

      await expect(service.create(mockFile, user)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockS3Service.deleteFile).toHaveBeenCalled();
    });
  });
});
