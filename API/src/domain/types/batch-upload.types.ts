import { PostModel } from 'src/application/post/models/post.model';

export interface BatchUploadResult {
    successful: {
        filename: string;
        post: PostModel;
    }[];
    failed: {
        filename: string;
        error: string;
    }[];
}
