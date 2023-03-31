import {Body, Controller, Get, Logger, Param, Put} from '@nestjs/common';
import {SessionService} from "../Providers/Session/session.service";


@Controller('session')
export class SessionController {
    constructor(
        private readonly sessionService: SessionService,
    ) {}

    private logger : Logger = new Logger('SessionController')

}
