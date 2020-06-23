import { Controller, Post, Body, ValidationPipe, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { User } from './user.model';


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}
    
    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<User> {
        return this.authService.signUp(authCredentialsDto);
    }

   @Post('/signin')
    signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<Object >{
        return this.authService.signIn(authCredentialsDto);
    }
    
}
