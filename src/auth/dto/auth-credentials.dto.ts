import { IsString, MinLength, MaxLength, Matches ,IsEmail,ValidateIf,IsNotEmpty} from "class-validator";

export class AuthCredentialsDto {
 
    @MinLength(4)
  
    name: string;  
  
    @IsEmail()
    email:string;
    
   
    @MinLength(4)//8
    //@MaxLength(20)
  /*  @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'password too weak' }
    )*/
    password: string;

 //  @ValidateIf(o => o.password === "hello")
    @IsNotEmpty()
    password2: string;


}
