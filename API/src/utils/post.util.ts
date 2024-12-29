import { PostModel } from "src/models/post.model";
import { Post } from "src/schemas/post.schema";

export class PostUtil {
    static mapToPostModel(post: Post): PostModel {
        return {
            id: post._id as string,
            imageIsBlurred: post.imageIsBlurred,
            createdAt: post["createdAt"],
            imagePath: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${post.imagePath}`
        };
    }
}