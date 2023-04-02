import * as mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema({
    sessionName: String,
    sender: String,
    message: String,
    type: String,
    creationDate: Date
});
