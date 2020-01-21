import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { TasksService} from './tasks.service';
import { Task, TaskStatus } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.model';


@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService){}
    
    @Get('filter')
    getFilter( @Query() filterDto: GetTasksFilterDto):  Task [] {
      if(Object.keys(filterDto).length){
        return this.tasksService.getFilter(filterDto);
      }else{
       // return this.tasksService.getAllTasks();
      }     
    }

    @Get('/:id')
    getTaskById(@Param('id') id:string,
                 @GetUser() user:User):  Promise<Task>{
        return this.tasksService.getTaskById(id,user);
    }

    @Get()
    getAllTasks(@GetUser() user:User ): Promise<Task[]> {
        return this.tasksService.getAllTasks(user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body()  createTaskDto: CreateTaskDto,
               @GetUser() user:User ):  Promise<Task>{
      return  this.tasksService.createTask(createTaskDto,user);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id:string,
              @GetUser() user:User): void{
         this.tasksService.deleteTassk(id,user);
    }

    @Patch('/:id')
    updateTaskStatus(
        @Param('id') id: string,
        @GetUser() user:User,
        @Body('status',TaskStatusValidationPipe,
        ) status: TaskStatus,@Body()  createTaskDto: CreateTaskDto,
    ): Promise<Task>{
        return this.tasksService.updateTaskStatus(id,createTaskDto, status,user);
    }
}
