import { Injectable, UnauthorizedException,ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import * as gravatar from 'gravatar';

@Injectable()
export class AuthService {
  constructor( @InjectModel('User') private  userModel:  Model<User>,private jwtService:  JwtService,) {
  
  }

  async signUp(authCredentialsDto:  AuthCredentialsDto): Promise<User> {
    let { name,email, password ,password2 } = authCredentialsDto;

    const exists= await this.userModel.findOne({name:name});
    if(exists){
        throw new ConflictException('Username already exists');
    }
    if(password.toString()!==password2.toString()){
        throw new  UnauthorizedException('Password not matched');
    }
    const salt = await bcrypt.genSalt();
    password = await this.hashPassword(password,salt);

    const avatar = gravatar.url(email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm' // Default
      });


    const user = new  this.userModel({name:name,email,password,salt,avatar});
    
  return await user.save();
   
}

 async signIn(authCredentialsDto: AuthCredentialsDto): Promise<Object> {
    const {email,name, password } = authCredentialsDto;
    console.log('name', email )
    const user =await  this.userModel.findOne({email:email});
    if (user) {
        const chek=await this.validatePassword(user.password,password, user.salt);
         if(chek){
            const payload : JwtPayload= { id:user._id,  email:user.email,name:user.name, avatar:user.avatar };
            const accessToken =this.jwtService.sign(payload);
            console.log(`Generated JWT Token with payload ${JSON.stringify(payload)}`);
    
            return { "token": 'Bearer '+accessToken };
        }
        throw new ConflictException('Password not matched');
      }
        throw new  UnauthorizedException('Mail does not exist !');
}


 async hashPassword(password: string, salt: string): Promise<string> {
     return bcrypt.hash(password, salt);
    }

async validatePassword(oldpw: string,newpw:string,salt:string): Promise<boolean> {
    const hash = await this.hashPassword(newpw, salt);
    return oldpw === hash;
}

}


