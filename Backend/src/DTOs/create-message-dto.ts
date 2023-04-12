export class CreateMessageDto {
    readonly sessionName: String;
    sender: String;
    message: String;
    type: String;
    creationDate: Date;
    buffer:Buffer;

    constructor(message: String, creationDate: Date, sender: String, sessionName: String, type: String, buffer: Buffer) {
      this.message = message;
      this.creationDate= creationDate;
      this.sender = sender;
      this.sessionName= sessionName;
      this.type = type;
      this.buffer = buffer;
    }
  }