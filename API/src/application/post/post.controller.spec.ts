import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';
import { PostModel } from './models/post.model';
import * as utils from 'src/shared/utils/file-validation.util';

describe('PostController', () => {
  let postController: PostController;

  const mockPostService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: mockPostService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    postController = module.get<PostController>(PostController);
  });

  describe('findAll', () => {
    it('should return a list of posts with metadata', async () => {
      const result = {
        data: [{ id: 1, imagePath: 'path', imageIsBlurred: false }],
        metadata: { page: 1, limit: 10, totalRecords: 1, totalPages: 1 },
      };
      mockPostService.findAll.mockResolvedValue(result);

      const req = { user: { userId: 'user1' } };
      expect(await postController.findAll(1, 10, req)).toEqual(result);
      expect(mockPostService.findAll).toHaveBeenCalledWith(1, 10, 'user1');
    });
  });

  describe('findById', () => {
    it('should return a single post', async () => {
      const post: PostModel = {
        id: 1,
        imagePath: 'path',
        imageIsBlurred: false,
        createdAt: new Date(),
        createdBy: 'user1',
      };
      mockPostService.findById.mockResolvedValue(post);

      expect(await postController.findById(1)).toEqual(post);
      expect(mockPostService.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new post and return it', async () => {
      const file = {
        buffer: Buffer.from(''),
        originalname: 'image.jpg',
      } as Express.Multer.File;
      const user = { userId: '1', nickname: 'user1' };
      const post: PostModel = {
        id: 1,
        imagePath: 'path',
        imageIsBlurred: false,
        createdAt: new Date(),
        createdBy: 'user1',
      };
      mockPostService.create.mockResolvedValue(post);

      const req = { user };
      jest.spyOn(utils, 'validateNotEmptyFile').mockImplementation(() => file);
      jest
        .spyOn(utils, 'validateImageMagicNumber')
        .mockImplementation(() => true);

      expect(await postController.create(file, req)).toEqual(post);
      expect(mockPostService.create).toHaveBeenCalledWith(file, user);
    });
  });

  describe('delete', () => {
    it('should delete a post', async () => {
      const req = { user: { userId: '1' } };
      mockPostService.delete.mockResolvedValue(undefined);

      await postController.delete(1, req);
      expect(mockPostService.delete).toHaveBeenCalledWith(1, '1');
    });
  });
});
