import {Document} from "mongoose";

export interface Message extends Document{
    sessionName: String,
    sender: String,
    message: String,
    type: String,
    creationDate: Date
}