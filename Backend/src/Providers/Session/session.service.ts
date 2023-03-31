import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Session} from "../../Interfaces/session.interface";
import {CreateSessionDto} from "../../DTOs/create-session-dto";

@Injectable()
export class SessionService {
    constructor(@InjectModel('Session') private readonly sessionModel: Model<Session>) {}

    private logger: Logger = new Logger('SessionService');

    async findOneById(idSession: String): Promise<Session> {
        return this.sessionModel.findOne({ idSession });
    }


    async createSession( session: CreateSessionDto): Promise<Session>{
        let newSession = new this.sessionModel(session);
        return newSession.save();
    }

    findOneBySocketIdAndEraseActivity(socketId: String){
        return this.sessionModel.findOneAndUpdate({socketId:socketId}, {socketId: null, active: false}).exec();
    }

    findOneBySocketIdAndAddActivity(socketId: String, username: String){
        return this.sessionModel.findOneAndUpdate({userName:username}, {socketId: socketId, active:true}, {new:true}).exec();
    }

}
