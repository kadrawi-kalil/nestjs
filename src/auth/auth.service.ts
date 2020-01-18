import { Injectable, UnauthorizedException,ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor( @InjectModel('User') private  userModel:  Model<User>,private jwtService:  JwtService,) {
  
  }

  async signUp(authCredentialsDto:  AuthCredentialsDto): Promise<void> {
    let { username, password } = authCredentialsDto;

    const exists= await this.userModel.findOne({username:username});
    if(exists){
        throw new ConflictException('Username already exists');
    }
    const salt = await bcrypt.genSalt();
    password = await this.hashPassword(password,salt);
    const user = new  this.userModel({username,password,salt}) ;
    
   await user.save();
}

 async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user =await  this.userModel.findOne({username:username});
    if (user) {
        const chek=await this.validatePassword(user.password,password, user.salt);
         if(chek){
            const payload : JwtPayload= { username };
            const accessToken =this.jwtService.sign(payload);
           // this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);
    
            return { accessToken };
        }}
        throw new  UnauthorizedException('Invalid credentials');
}

 async hashPassword(password: string, salt: string): Promise<string> {
     return bcrypt.hash(password, salt);
    }

async validatePassword(oldpw: string,newpw:string,salt:string): Promise<boolean> {
    const hash = await this.hashPassword(newpw, salt);
    return oldpw === hash;
}

}


