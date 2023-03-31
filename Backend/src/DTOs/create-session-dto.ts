
export class CreateSessionDto {
    readonly id: string;
    participants: string[];
    mensajes: any[];
    readonly creationDate: Date;
  }