import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileSchema } from './schemas/profile.schema';
import { UserSchema } from '../auth/schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule
    ,MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema },{ name: 'User', schema: UserSchema }])],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule {}
