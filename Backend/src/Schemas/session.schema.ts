import * as mongoose from 'mongoose';

export const SessionSchema = new mongoose.Schema({
    id: String,
    participants:{},
    mensajes:[],
    creationDate: Date
});
