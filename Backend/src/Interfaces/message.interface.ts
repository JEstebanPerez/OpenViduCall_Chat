import {Document} from "mongoose";

export interface Message extends Document{
    sessionName: String,
    sender: String,
    message: String,
    type: String,
    cookie: String,
    creationDate: Date,
    buffer: Buffer
}