import {Body, Controller, Get, Logger, Param, Post, Put} from '@nestjs/common';
import {SessionService} from "../Providers/Session/session.service";
import { CreateSessionDto } from 'src/DTOs/create-session-dto';


@Controller('api')
export class SessionController {
    constructor(private readonly sessionService: SessionService) {}

    private logger : Logger = new Logger('SessionController')

    @Post('session')
    async createSession(@Body('sessionName') sessionName: String){
        let session = await this.sessionService.findOneBySessionName(sessionName);
        if(session === null) return await this.sessionService.createSession(sessionName);
        else return null;
    }


}
