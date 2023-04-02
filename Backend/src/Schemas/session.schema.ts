import * as mongoose from 'mongoose';

export const SessionSchema = new mongoose.Schema({
    sessionName: String,
    /*participants:{},
    message:[],*/
    creationDate: Date
});
