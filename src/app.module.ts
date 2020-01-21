import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TestModule } from './test/test.module';
import * as config from 'config';
const dbConfig = config.get('db');

@Module({
  imports: [TasksModule,MongooseModule.forRoot(`mongodb+srv://${dbConfig.username}:${dbConfig.password}@cluster0-3f2cx.mongodb.net/${dbConfig.database}?retryWrites=true&w=majority`,{  useNewUrlParser: true , useUnifiedTopology: true} ), AuthModule, TestModule],
 
})
export class AppModule {}
