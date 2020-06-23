import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ProfileService} from './profile.service';
import { Profile } from './profile.model';
import { CreateProfileDto,CreateExperienceDto,CreateEducationDto} from './dto/create-profile.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.model';


@Controller('profile')
export class ProfileController {
    constructor(private profilesService: ProfileService){}

    // @route   GET api/profile/test
    // @desc    Tests profile route
    // @access  Public
    @Get('test/:id')
    getAllProfile(): String { return "Profile works";  }

    // @route   GET api/profile
    // @desc    Get current users profile
    // @access  Private
    @Get()
    @UseGuards(AuthGuard())
    getProfile(@GetUser() user:User ): Promise<Profile > {
        return this.profilesService.getProfile(user);
    }

    // @route   GET api/profile/all
    // @desc    Get all profiles
    // @access  Public
    @Get('all')
    getAllProfiles(): Promise<Profile[] > {
        return this.profilesService.getAllProfiles();
    }

    // @route   GET api/profile/handle/:handle
    // @desc    Get profile by handle
    // @access  Public
    @Get('user/:id')
    @UseGuards(AuthGuard())
    getProfileByUserId(@Param('id') id:string):  Promise<Profile>{
        return this.profilesService.getProfileByUserId(id);
    }
    
    // @route   GET api/profile/user/:user_id
    // @desc    Get profile by user ID
    // @access  Public
    @Get('handle/:handle')
    @UseGuards(AuthGuard())
    getProfileByHandle(@Param('handle') handle:string):  Promise<Profile>{
        return this.profilesService.getProfileByHandle(handle);
    }

    // @route   POST api/profile
    // @desc    Create or edit user profile
    // @access  Private
    @Post()
    @UseGuards(AuthGuard())
    createProfile(@Body()  createProfileDto: CreateProfileDto,
                 @GetUser() user:User ):  Promise<Profile>{
      return  this.profilesService.updateProfile(createProfileDto,user);
    }

    // @route   POST api/profile/experience
    // @desc    Add experience to profile
    // @access  Private
    @Post('experience')
    @UseGuards(AuthGuard())
    addExperienceToProfile(@Body()  createExperienceDto: CreateExperienceDto,
                 @GetUser() user:User ):  Promise<Profile>{
      return  this.profilesService.addExperienceToProfile(createExperienceDto,user);
    }


    // @route   POST api/profile/education
    // @desc    Add education to profile
    // @access  Private
    @Post('education')
    @UseGuards(AuthGuard())
    addEducationToProfile(@Body()  createEducationDto: CreateEducationDto,
                 @GetUser() user:User ):  Promise<Profile>{
      return  this.profilesService.addEducationToProfile(createEducationDto,user);
    }

    // @route   DELETE api/profile/experience/:exp_id
    // @desc    Delete experience from profile
    // @access  Private
    @Delete('experience/:id')
    @UseGuards(AuthGuard())
    deleteExperienceFromProfile(@Param('id') id:string,
                 @GetUser() user:User ):  Promise<Profile>{
      return  this.profilesService.deleteExperienceFromProfile(id,user);
    }

    // @route   DELETE api/profile/education/:edu_id
    // @desc    Delete education from profile
    // @access  Private
    @Delete('education/:id')
    @UseGuards(AuthGuard())
    deleteEducationFromProfile(@Param('id') id:string,
                 @GetUser() user:User ):  Promise<Profile>{
      return  this.profilesService.deleteEducationFromProfile(id,user);
    }

    // @route   DELETE api/profile
    // @desc    Delete user and profile
    // @access  Private
    @Delete('')
    @UseGuards(AuthGuard())
    deleteUserAndProfile(@GetUser() user:User ):  Promise<Object>{
      return  this.profilesService.deleteUserAndProfile(user);
    }
    
}
