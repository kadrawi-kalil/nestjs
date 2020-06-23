import { Injectable, NotFoundException } from '@nestjs/common';
import { Profile, Social,Education,Experience } from './profile.model';
import { CreateProfileDto,CreateExperienceDto,CreateEducationDto,CreateSocialDto,ProfileDto} from './dto/create-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/user.model';
@Injectable()
export class ProfileService {
    constructor( @InjectModel('Profile') private  profileModel: Model<Profile>, @InjectModel('User') private  userModel:  Model<User>) {}

    // @route   GET api/profile
    // @desc    Get current users profile
    // @access  Private
    async getProfile(user: User ): Promise<Profile> {
        return  await this.profileModel.findOne({ user:user._id}).populate('user');
      }

    // @route   GET api/profile/all
    // @desc    Get all profiles
    // @access  Public
    async getAllProfiles(): Promise<Profile[]> {
        return await this.profileModel.find().populate('user');
      }

    // @route   GET api/profile/handle/:handle
    // @desc    Get profile by handle
    // @access  Public
    async  getProfileByUserId(id:string  ): Promise<Profile>{
        const found= await this.profileModel.find({user:id}).populate('user', ['name', 'avatar']);
         if(!found){
             throw new NotFoundException(`no ${id} exit`);
         }
         return found;
     }

    // @route   GET api/profile/user/:user_id
    // @desc    Get profile by user ID
    // @access  Public
     async  getProfileByHandle(handle:string ): Promise<Profile>{
        const found= await this.profileModel.findOne({handle:handle}).populate('user');
         if(!found){
             throw new NotFoundException(`no ${handle} exit`);
         }
         return found;
     }


    // @route   POST api/profile
    // @desc    Create or edit user profile
    // @access  Private
    async createProfile(createProfileDto: CreateProfileDto,userAuth: User ): Promise<Profile> { 
        const { handle,company,website,location,status,skills,bio,githubusername}=createProfileDto;
        const createdProfile = new this.profileModel({ user:userAuth._id,handle,company,website,location,status,skills,bio,githubusername});
        return await createdProfile.save();
      }


    // @route   POST api/profile
    // @desc    Create or edit user profile
    // @access  Private
    async updateProfile(createProfileDto: CreateProfileDto, userAuth: User): Promise<Profile> {
        const  profileFields  =new   ProfileDto();
        
        profileFields.user = userAuth._id;
        if (createProfileDto.handle) profileFields.handle = createProfileDto.handle;
        if (createProfileDto.company) profileFields.company = createProfileDto.company;
        if (createProfileDto.website) profileFields.website = createProfileDto.website;
        if (createProfileDto.location) profileFields.location = createProfileDto.location;
        if (createProfileDto.bio) profileFields.bio = createProfileDto.bio;
        if (createProfileDto.status) profileFields.status = createProfileDto.status;
        if (createProfileDto.githubusername) profileFields.githubusername = createProfileDto.githubusername;
        if (typeof createProfileDto.skills !== 'undefined') {  profileFields.skills = createProfileDto.skills;}
        const  socialFields  =new   CreateSocialDto();
        console.log(createProfileDto)
        if (createProfileDto.youtube) socialFields.youtube = createProfileDto.youtube;
        if (createProfileDto.twitter) socialFields.twitter = createProfileDto.twitter;
        if (createProfileDto.facebook) socialFields.facebook = createProfileDto.facebook;
        if (createProfileDto.linkedin) socialFields.linkedin = createProfileDto.linkedin;
        if (createProfileDto.instagram) socialFields.instagram = createProfileDto.instagram;
        profileFields.social = socialFields;
        const found= await this.profileModel.find({user:userAuth._id});
        console.log(found.length)
        if(found.length==0){   
          return await  new this.profileModel(profileFields).save()
        }
        return await  this.profileModel.findOneAndUpdate({user:userAuth._id},{ $set: profileFields },{ new: true });   
    }

    // @route   POST api/profile/experience
    // @desc    Add experience to profile
    // @access  Private
    async addExperienceToProfile(createExperienceDto: CreateExperienceDto, userAuth: User): Promise<Profile> {
      let   profileFields  =new   CreateProfileDto();
      const newExp :CreateExperienceDto = {
        title: createExperienceDto.title,
        company: createExperienceDto.company,
        location: createExperienceDto.location,
        from: createExperienceDto.from,
        to: createExperienceDto.to,
        current: createExperienceDto.current,
        description: createExperienceDto.description
      };
      const  found= await this.profileModel.find({user:userAuth._id})
      profileFields=found[0];
      profileFields.experience.unshift(newExp);
     
  return await  this.profileModel.findOneAndUpdate({user:userAuth._id},{ $set: profileFields },{ new: true }); 
  }


  // @route   POST api/profile/education
  // @desc    Add education to profile
  // @access  Private
  async addEducationToProfile(createEducationDto: CreateEducationDto, userAuth: User): Promise<Profile> {
    let   profileFields  =new   CreateProfileDto();
    const newEdu :CreateEducationDto = {
      school: createEducationDto.school,
      degree: createEducationDto.degree,
      fieldofstudy: createEducationDto.fieldofstudy,
      from: createEducationDto.from,
      to: createEducationDto.to,
      current: createEducationDto.current,
      description: createEducationDto.description
    };
    const  found= await this.profileModel.find({user:userAuth._id})
    profileFields=found[0];
    profileFields.education.unshift(newEdu);
   
return await  this.profileModel.findOneAndUpdate({user:userAuth._id},{ $set: profileFields },{ new: true }); 
}

    // @route   DELETE api/profile/experience/:exp_id
    // @desc    Delete experience from profile
    // @access  Private
    async deleteExperienceFromProfile(id:string , userAuth: User): Promise<Profile> {
      let   profile;
      const  found= await this.profileModel.find({user:userAuth._id})
      profile=found[0];
         // Get remove index
         const removeIndex = profile.experience
         .map(item => item.id)
         .indexOf(id);

       // Splice out of array
       profile.experience.splice(removeIndex, 1);

       // Save
  return await  this.profileModel.findOneAndUpdate({user:userAuth._id},{ $set: profile },{ new: true }); 
  }


    // @route   DELETE api/profile/education/:edu_id
    // @desc    Delete education from profile
    // @access  Private
    async deleteEducationFromProfile(id:string , userAuth: User): Promise<Profile> {
      let   profile;
      const  found= await this.profileModel.find({user:userAuth._id})
      profile=found[0];
         // Get remove index
         const removeIndex = profile.education
         .map(item => item.id)
         .indexOf(id);

       // Splice out of array
       profile.education.splice(removeIndex, 1);

       // Save
  return await  this.profileModel.findOneAndUpdate({user:userAuth._id},{ $set: profile },{ new: true }); 
 }

 async deleteUserAndProfile( userAuth: User): Promise<Object> {
 try{ 
  await this.profileModel.findOneAndRemove({user:userAuth._id});
  await this.userModel.findOneAndRemove({_id:userAuth._id});
  return { success: true }; 
 }
 catch(e){
  return { success: false };
 }
}
}
