import * as Buffer from "buffer";

export class Message{
    _id: String;
    sessionName: String | undefined;
    sender: String;
    message: String;
    type: String;
    creationDate: Date;

    constructor (_id:String, sessionName: String, sender: String, message: String, type:String){
        this._id= _id;
        this.sessionName= sessionName;
        this.sender = sender;
        this.message=message;
        this.type= type;
        this.creationDate= new Date();

    }

}
