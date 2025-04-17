import { PostModel } from "src/models/post.model";
import { Post } from "src/entities/post.entity";

export class PostUtil {
    static mapToPostModel(post: Partial<Post>): PostModel {
        return {
            id: post.id,
            imageIsBlurred: post.imageIsBlurred,
            createdAt: post.createdAt,
            createdBy: post.createdBy,
            imagePath: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${post.imagePath}`
        };
    }
}