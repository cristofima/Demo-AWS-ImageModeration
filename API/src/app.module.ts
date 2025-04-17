import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Post],
      schema: 'public',
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Post]),
    PassportModule,
  ],
  controllers: [PostController],
  providers: [PostService, JwtStrategy],
})
export class AppModule { }
