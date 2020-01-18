import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
export const TaskSchema = new mongoose.Schema({
    id:  {
        type: String,
        },

    title: {
        type: String,
        },

    description: {
        type: String,    
        },

    status: {
        type: String,
        },

    userId: {
        type: Schema.Types.ObjectId,

      }
});

