import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor( @InjectModel('User') private  userModel:  Model<User>) {

  }

  async signUp(authCredentialsDto:  AuthCredentialsDto): Promise<void> {
    let { username, password } = authCredentialsDto;

    const exists= await this.userModel.findOne({username:username});
    if(exists){
        throw new ConflictException('Username already exists');
    }
    const salt = "salt";//await bcrypt.genSalt();
     password = await this.hashPassword(password,salt);
    const user = new  this.userModel({username,password,salt}) ;
    
    //user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

   await user.save();
  
}

async signIn(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;
    const user =await  this.userModel.findOne({username:username});
    const chek=await this.validatePassword(user.password,password, user.salt);
    if (user ) {
        if(chek){
            return user;
        }
        return null
    }
}

private async hashPassword(password: string, salt: string): Promise<string> {
    //  return bcrypt.hash(password, salt);
    return (password +salt);
    }

    async validatePassword(oldpw: string,newpw:string,salt:string): Promise<boolean> {
        const hash = await this.hashPassword(newpw, salt);
        console.log(oldpw,newpw)
        return oldpw === hash;
    }

}


