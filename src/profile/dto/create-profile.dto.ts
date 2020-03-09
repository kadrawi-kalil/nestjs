import { IsNotEmpty} from 'class-validator';

export class CreateProfileDto {

  user: string;

  @IsNotEmpty()
  handle: string;

  @IsNotEmpty()
  company: string;

 
  website: string;

 
  location:string;

  
  status: string;


  skills: [string];

  bio: string;
  githubusername: string;
  experience: [CreateExperienceDto];
  education: [CreateEducationDto];
  social : CreateSocialDto;
  profileFields: CreateExperienceDto[];
  
}

export class  CreateExperienceDto {
  title: string;
  company: string;
  location: string;
  from: string;
  to: string;
  current: string;
  description: string;
}


export class  CreateEducationDto {
  school: string;
  degree: string;
  fieldofstudy: string;
  from: string;
  to: string;
  current: string;
  description: string;
}

export class  CreateSocialDto {
  youtube: string;
  twitter: string;
  facebook: string;
  linkedin: string;
  instagram: string;
}
