import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PostController } from './controllers/post.controller';
import { Post, PostSchema } from './schemas/post.schema';
import { PostService } from './services/post.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class AppModule { }
