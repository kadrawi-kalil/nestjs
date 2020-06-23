import { Injectable,NotFoundException,UnauthorizedException } from '@nestjs/common';
import { CreatePostDto,CreateCommentDto} from './dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/auth/user.model';
import { Posts } from './posts.model';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
    constructor( @InjectModel('Post') private  postModel: Model<Posts>) {}
    // @route   GET api/posts
    // @desc    Get posts
    // @access  Public
    async getAllPosts(): Promise<Posts[]> {
        return await this.postModel.find();
      }
    // @route   GET api/posts/:id
    // @desc    Get post by id
    // @access  Public
    async  getPostById(id:string ): Promise<Posts>{
        const found= await this.postModel.findOne({_id:id}).populate('users', ['name', 'avatar']);
         if(!found){
             throw new NotFoundException(`no ${id} exit`);
         }
         return found;
     }

    // @route   POST api/posts
    // @desc    Create post
    // @access  Private
    async createProfile(createPostDto: CreatePostDto,userAuth: User ): Promise<Posts> { 
        const { text,name,avatar}=createPostDto;
        const createdProfile = new this.postModel({ user:userAuth._id,text,name,avatar});
        return await createdProfile.save();
      }
    // @route   DELETE api/posts/:id
    // @desc    Delete post
    // @access  Private
    async deletePost(id:string , userAuth: User): Promise<Object> {
        const post= await this.postModel.find({_id:id})
        console.log(post[0].user,userAuth._id)
        if (post[0].user.toString() !== userAuth._id.toString()) {
            return { success: false };
        }else{
            await this.postModel.findOneAndRemove({_id:id});
       
         return { success: true }; 
        }
       }

    // @route   POST api/posts/like/:id
    // @desc    Like post
    // @access  Private
    async likePost(id: String, userAuth: User): Promise<Posts> {
        let   postFields  =new   CreatePostDto();
       
        const  found= await this.postModel.find({_id:id})
        postFields=found[0];
        if (
            postFields.likes.filter(like => like.user.toString() === userAuth._id.toString())
              .length > 0
          ){
            throw new UnauthorizedException('User already liked this post')
          }
        postFields.likes.unshift({ user: userAuth._id });
       
    return await  this.postModel.findOneAndUpdate({_id:id},{ $set: postFields },{ new: true }); 
    }

    // @route   POST api/posts/unlike/:id
    // @desc    Unlike post
    // @access  Private
    async unlikePost(id: String, userAuth: User): Promise<Posts> {
        let   postFields  =new   CreatePostDto();
       
        const  found= await this.postModel.find({_id:id})
        postFields=found[0];
        if (
            postFields.likes.filter(like => like.user.toString() === userAuth._id.toString())
              .length === 0
          ){
            throw new UnauthorizedException('You have not yet liked this post')
          }
        // Get remove index
          const removeIndex = postFields.likes
          .map(item => item.user.toString())
          .indexOf(userAuth._id);

        // Splice out of array
        postFields.likes.splice(removeIndex, 1);
       
    return await  this.postModel.findOneAndUpdate({_id:id},{ $set: postFields },{ new: true }); 
    }

    // @route   POST api/posts/comment/:id
    // @desc    Add comment to post
    // @access  Private
    async commentPost(id: String,createCommentDto: CreateCommentDto, userAuth: User): Promise<Posts> {
        let   postFields  =new   CreatePostDto();
        let newComment = new CreateCommentDto();
        newComment=createCommentDto;
        newComment.user=userAuth._id;
       
        const  found= await this.postModel.find({_id:id})
        postFields=found[0];
        postFields.comments.unshift(newComment);
       
    return await  this.postModel.findOneAndUpdate({_id:id},{ $set: postFields },{ new: true }); 
    }

    // @route   DELETE api/posts/comment/:id/:comment_id
    // @desc    Remove comment from post
    // @access  Private
    async deleteCommentFromPost(post_id: string,comment_id:string, userAuth: User): Promise<Posts> {
        let   postFields  =new   CreatePostDto();
       
        const  found= await this.postModel.find({_id:post_id})
        postFields=found[0];
        if (
            postFields.comments.filter(
                comment => comment._id.toString() === comment_id.toString()
              ).length === 0
          ){
            throw new UnauthorizedException('Comment does not exist')
          }
        // Get remove index
        const removeIndex = postFields.comments
          .map(item => item._id.toString())
          .indexOf(comment_id);

        // Splice comment out of array
        postFields.comments.splice(removeIndex, 1);
       
    return await  this.postModel.findOneAndUpdate({_id:post_id},{ $set: postFields },{ new: true }); 
    }
}
