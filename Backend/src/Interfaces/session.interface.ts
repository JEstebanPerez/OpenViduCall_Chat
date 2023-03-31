import {Document} from "mongoose";

export interface Session extends Document{
    id: String,
    participants:string[],
    mensajes:any[],
    creationDate: Date
}
