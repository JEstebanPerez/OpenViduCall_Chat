
export class Message{
    _id: String;
    sessionName: String | undefined;
    sender: String;
    message: String;
    image: String;
    cookie: String;
    type: String;
    creationDate: Date;
    buffer: Buffer;

    constructor (_id:String, sessionName: String, sender: String, message: String, type:String, image:String, cookie:String, buffer: Buffer){
        this._id= _id;
        this.sessionName= sessionName;
        this.sender = sender;
        this.message=message;
        this.image=image;
        this.cookie=cookie;
        this.type= type;
        this.creationDate= new Date();
        this.buffer = buffer;
    }

}
