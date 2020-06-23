import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './schemas/post.schema';
import { UserSchema } from '../auth/schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [
    AuthModule
    ,MongooseModule.forFeature([{ name: 'Post', schema: PostSchema },{ name: 'User', schema: UserSchema }])],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
