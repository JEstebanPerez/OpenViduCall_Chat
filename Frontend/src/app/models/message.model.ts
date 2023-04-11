import * as Buffer from "buffer";

export class Message{
    sessionName: String | undefined;
    sender: String;
    message: String;
    type: String;
    creationDate: Date;

    constructor (sessionName: String, sender: String, message: String, type:String){
        this.sessionName= sessionName;
        this.sender = sender;
        this.message=message;
        this.type= type;
        this.creationDate= new Date();

    }

}
