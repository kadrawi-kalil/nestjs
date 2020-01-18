import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    
    id: {
        type: String,
      },

    username: {
        type: String,
        required: true
      },

    password: {
        type: String,
        required: true
      },

    salt: {
        type: String,
      },
});

