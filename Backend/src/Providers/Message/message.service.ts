import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Message} from "../../Interfaces/message.interface";
import {CreateMessageDto} from "../../DTOs/create-message-dto";

@Injectable()
export class MessageService {
    constructor(@InjectModel('Message') private readonly messageModel: Model<Message>) {}

    private logger: Logger = new Logger('MessageService');

    async findBySessionName(sessionName: String): Promise<Message[]> {
        return this.messageModel.find({ sessionName });
    }

    async findAll(): Promise<Message[]> {
        return this.messageModel.find();
    }


    async createMessage( sessionName: String, message: String, sender: String): Promise<Message>{
        let newMessage = new this.messageModel();
        newMessage.sessionName=sessionName;
        newMessage.message=message;
        newMessage.sender= sender;
        newMessage.creationDate= new Date();
        return newMessage.save();
    }

    /*async addMessage(sessionName: String, message: any, isPrivate:boolean) {
        let session = await this.sessionModel.findOne({sessionName});

        if(session.message == null) session.message = [message];
        else session.message.unshift(message);

        session.save();
    }

    async addParticipants(sessionName: String, userName: any, isPrivate:boolean) {
        let session = await this.sessionModel.findOne({sessionName});

        if(session.participants == null) session.participants = [userName];
        else session.participants.unshift(userName);

        session.save();
    }*/


    findOneBySocketIdAndEraseActivity(socketId: String){
        return this.messageModel.findOneAndUpdate({socketId:socketId}, {socketId: null, active: false}).exec();
    }

    findOneBySocketIdAndAddActivity(socketId: String, username: String){
        return this.messageModel.findOneAndUpdate({userName:username}, {socketId: socketId, active:true}, {new:true}).exec();
    }

}
