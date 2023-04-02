export class CreateMessageDto {
    readonly sessionName: String;
    sender: String;
    message: String;
    type: String;
    creationDate: Date;
  }