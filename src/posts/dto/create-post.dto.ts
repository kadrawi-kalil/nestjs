import { IsNotEmpty} from 'class-validator';

export class CreatePostDto {


  user: string;
  @IsNotEmpty()
  text: string;
  name: string;
  avatar: string;
  likes: [CreateLikeDto];
  comments: [CreateCommentDto];
  date : Date;
  
}

export class  CreateLikeDto {
  user: string;
}


export class   CreateCommentDto {
  _id:string;
  user: string;
  text: string;
  name: string;
  avatar: string;
  date : Date;
}

