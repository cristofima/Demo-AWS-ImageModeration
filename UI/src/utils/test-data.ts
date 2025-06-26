import { Post, Pagination } from '../interfaces';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export const mockPost: Post = {
    id: 1,
    imagePath: 'https://example.com/image1.jpg',
    imageIsBlurred: false,
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
};

export const mockBlurredPost: Post = {
    id: 2,
    imagePath: 'https://example.com/image2.jpg',
    imageIsBlurred: true,
    createdAt: new Date('2023-01-02T00:00:00.000Z'),
};

export const mockPosts: Post[] = [
    mockPost,
    mockBlurredPost,
    {
        id: 3,
        imagePath: 'https://example.com/image3.jpg',
        imageIsBlurred: false,
        createdAt: new Date('2023-01-03T00:00:00.000Z'),
    },
    {
        id: 4,
        imagePath: 'https://example.com/image4.jpg',
        imageIsBlurred: true,
        createdAt: new Date('2023-01-04T00:00:00.000Z'),
    },
];

export const mockPaginationResponse: Pagination = {
    data: mockPosts,
    metadata: {
        page: 1,
        limit: 12,
        totalRecords: 4,
        totalPages: 1,
    },
};

const mockConfig: InternalAxiosRequestConfig = {
    headers: {},
} as InternalAxiosRequestConfig;

export const mockAxiosResponse: AxiosResponse<Pagination> = {
    data: mockPaginationResponse,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: mockConfig,
};

export const mockEmptyPaginationResponse: Pagination = {
    data: [],
    metadata: {
        page: 1,
        limit: 12,
        totalRecords: 0,
        totalPages: 0,
    },
};

export const mockEmptyAxiosResponse: AxiosResponse<Pagination> = {
    data: mockEmptyPaginationResponse,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: mockConfig,
};

export const mockSecondPageResponse: Pagination = {
    data: [
        {
            id: 5,
            imagePath: 'https://example.com/image5.jpg',
            imageIsBlurred: false,
            createdAt: new Date('2023-01-05T00:00:00.000Z'),
        },
        {
            id: 6,
            imagePath: 'https://example.com/image6.jpg',
            imageIsBlurred: true,
            createdAt: new Date('2023-01-06T00:00:00.000Z'),
        },
    ],
    metadata: {
        page: 2,
        limit: 12,
        totalRecords: 6,
        totalPages: 2,
    },
};

export const mockSecondPageAxiosResponse: AxiosResponse<Pagination> = {
    data: mockSecondPageResponse,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: mockConfig,
};
