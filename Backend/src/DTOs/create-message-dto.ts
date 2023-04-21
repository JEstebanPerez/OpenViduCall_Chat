export class CreateMessageDto {
    readonly sessionName: String;
    sender: String;
    message: String;
    type: String;
    cookie: String;
    creationDate: Date;
    buffer:Buffer;

    constructor(message: String, creationDate: Date, sender: String, sessionName: String, type: String, cookie: String, buffer: Buffer) {
      this.message = message;
      this.creationDate= creationDate;
      this.sender = sender;
      this.sessionName= sessionName;
      this.type = type;
      this.cookie= cookie;
      this.buffer = buffer;
    }
  }