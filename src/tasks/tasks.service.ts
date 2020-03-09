import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/user.model';

@Injectable()
export class TasksService {
    constructor( @InjectModel('Task') private  taskModel: Model<Task>) {}
    
    async createTask(createTaskDto: CreateTaskDto,user: User ): Promise<Task> { 
        const { title,description}=createTaskDto;
        const userId=user._id;
        
        const createdTask = new this.taskModel({ title,description,status: TaskStatus.OPEN,userId});
        return await createdTask.save();
      }

    async getAllTasks(user: User ): Promise<Task[]> {
        return await this.taskModel.find({ userId:user._id});
      }
    

    async  getTaskById(id:string,user: User ): Promise<Task>{
       const found= await this.taskModel.find({_id:id, userId:user._id});
        if(!found){
            throw new NotFoundException(`no ${id} exit`);
        }
        return found;
    }

    async deleteTassk(id:string,user: User): Promise<void> {
       const found =   await this.getTaskById(id,user);
       if(found){
        await this.taskModel.deleteOne({ _id:id});
       }
     
    }

    async updateTaskStatus(id: string,createTaskDto: CreateTaskDto, status: TaskStatus,user: User): Promise<Task> {
        const task = await  this.taskModel.findById(id);
        const { title,description}=createTaskDto;
        
        task.title=title;
        task.description=description;
        task.status = status;
        const createdTask = new this.taskModel(task);
       
        if((task.userId).toString() ===( user._id).toString()){
            return await createdTask.save();
        }
        throw new NotFoundException(`no ${id} exit`);
     
    }
}
