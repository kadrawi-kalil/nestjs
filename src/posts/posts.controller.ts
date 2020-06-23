import { Posts } from './posts.model';
import { CreatePostDto,CreateCommentDto} from './dto/create-post.dto';
import { Controller, Get, Post, Body, Param, Delete, UseGuards} from '@nestjs/common';
import { PostsService} from './posts.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.model';

@Controller('posts')
export class PostsController {
    constructor(private postService: PostsService){}

    @Get('test')
    getAllTasks(): String {
        return "posts works";
    }

    // @route   GET api/posts
    // @desc    Get posts
    // @access  Public
    @Get()
    getAllPosts(): Promise<Posts[]> {
        return this.postService.getAllPosts();
    }
    // @route   GET api/posts/:id
    // @desc    Get post by id
    // @access  Public
    @Get('/:id')
    @UseGuards(AuthGuard())
    getPostById(@Param('id') id:string):  Promise<Posts>{
        return this.postService.getPostById(id);
    }
    // @route   POST api/posts
    // @desc    Create post
    // @access  Private
    @Post()
    @UseGuards(AuthGuard())
    createPost(@Body()  createPostDto: CreatePostDto,
                 @GetUser() user:User ):  Promise<Posts>{
      return  this.postService.createProfile(createPostDto,user);
    }
    // @route   DELETE api/posts/:id
    // @desc    Delete post
    // @access  Private
    @Delete('/:id')
    @UseGuards(AuthGuard())
    deletePost(@GetUser() user:User,
                        @Param('id') id:string ):  Promise<Object>{
      return  this.postService.deletePost( id,user);
    }

    // @route   POST api/posts/like/:id
    // @desc    Like post
    // @access  Private
    @Post('like/:id')
    @UseGuards(AuthGuard())
    likePost( @Param('id') id:string,
                 @GetUser() user:User ):  Promise<Posts>{
      return  this.postService.likePost(id,user);
    }
    // @route   POST api/posts/unlike/:id
    // @desc    Unlike post
    // @access  Private
    @Post('unlike/:id')
    @UseGuards(AuthGuard())
    unlikePost( @Param('id') id:string,
                 @GetUser() user:User ):  Promise<Posts>{
      return  this.postService.unlikePost(id,user);
    }
    // @route   POST api/posts/comment/:id
    // @desc    Add comment to post
    // @access  Private
    @Post('comment/:id')
    @UseGuards(AuthGuard())
    commentPost( @Param('id') id:string,
                 @Body()  createCommentDto: CreateCommentDto,
                 @GetUser() user:User ):  Promise<Posts>{
      return  this.postService.commentPost(id,createCommentDto,user);
    }
    // @route   DELETE api/posts/comment/:id/:comment_id
    // @desc    Remove comment from post
    // @access  Private
    @Delete('comment/:post_id/:comment_id')
    @UseGuards(AuthGuard())
    deleteCommentFromPost( @Param('post_id') post_id:string,
                           @Param('comment_id') comment_id:string,
                           @GetUser() user:User ):  Promise<Posts>{
      return  this.postService.deleteCommentFromPost(post_id,comment_id,user);
    }
}
