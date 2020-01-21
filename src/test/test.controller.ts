import { Controller, Get ,Response} from '@nestjs/common';


@Controller('')
export class TestController {
    @Get()
    test( ):  any{
        return  '<a href="https://github.com/kadrawi-kalil/nestjs">See the  code  in github</a>' ;
    }
    

}
