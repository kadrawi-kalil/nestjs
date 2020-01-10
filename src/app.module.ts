import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [TasksModule,MongooseModule.forRoot('mongodb://localhost/nest',{  useNewUrlParser: true , useUnifiedTopology: true} ), AuthModule],
 
})
export class AppModule {}
