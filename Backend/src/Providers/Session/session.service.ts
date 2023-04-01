import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Session} from "../../Interfaces/session.interface";
import {CreateSessionDto} from "../../DTOs/create-session-dto";

@Injectable()
export class SessionService {
    constructor(@InjectModel('Session') private readonly sessionModel: Model<Session>) {}

    private logger: Logger = new Logger('SessionService');

    async findOneBySessionName(sessionName: String): Promise<Session> {
        return this.sessionModel.findOne({ sessionName });
    }


    async createSession( sessionName: String): Promise<Session>{
        let newSession = new this.sessionModel();
        newSession.sessionName=sessionName;
        newSession.participants=[];
        newSession.message=[];
        newSession.creationDate= new Date();
        return newSession.save();
    }

    async addMessage(sessionName: String, message: any, isPrivate:boolean) {
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
    }


    findOneBySocketIdAndEraseActivity(socketId: String){
        return this.sessionModel.findOneAndUpdate({socketId:socketId}, {socketId: null, active: false}).exec();
    }

    findOneBySocketIdAndAddActivity(socketId: String, username: String){
        return this.sessionModel.findOneAndUpdate({userName:username}, {socketId: socketId, active:true}, {new:true}).exec();
    }

}
