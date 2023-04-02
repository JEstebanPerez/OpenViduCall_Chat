import {Document} from "mongoose";

export interface Session extends Document{
    sessionName: String,
    /*participants:String[],
    message:any[],*/
    creationDate: Date
}
