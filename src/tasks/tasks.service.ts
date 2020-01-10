import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TasksService {
    private tasks : Task[] = [];
    constructor( @InjectModel('Task') private  taskModel: Model<Task>) {}
    
    async createTask(createTaskDto: CreateTaskDto): Promise<Task> { 
        const { title,description}=createTaskDto;
        const createdTask = new this.taskModel({ title,description,status: TaskStatus.OPEN,});
        return await createdTask.save();
      }

    async getAllTasks(): Promise<Task[]> {
        return await this.taskModel.find();
      }
    
    getFilter(
        filterDto: GetTasksFilterDto,
    ): Task[] {
        return this.tasks;
    }

    async  getTaskById(id:string): Promise<Task>{
       const found= await this.taskModel.findById(id);
        if(!found){
            throw new NotFoundException(`no ${id} exit`);
        }
        return found;
    }

    async deleteTassk(id:string): Promise<void> {
       const found =   await this.getTaskById(id);
       if(found){
        await this.taskModel.deleteOne({ _id:id});
       }
     
    }

    async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
        const task = await  this.getTaskById(id);
        task.status = status;
        const createdTask = new this.taskModel(task);
        return await createdTask.save();
    }
}
