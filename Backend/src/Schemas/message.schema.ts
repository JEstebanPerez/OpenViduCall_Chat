import * as mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema({
    sessionName: String,
    sender: String,
    message: String,
    type: String,
    cookie: String,
    creationDate: Date,
    buffer:Buffer
});
