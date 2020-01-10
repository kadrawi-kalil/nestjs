import * as mongoose from 'mongoose';

export const TaskSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    status: String ,
});

