import { Controller, Get } from '@nestjs/common';


@Controller('posts')
export class PostsController {

    @Get()
    getAllTasks(): String {
        return "posts works";
    }
}
