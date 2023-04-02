import {Body, Controller, Get, Logger, Param, Post, Put} from '@nestjs/common';
import {MessageService} from "../Providers/Message/message.service";
import { CreateMessageDto } from 'src/DTOs/create-message-dto';


@Controller('api')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    private logger : Logger = new Logger('MessageController')

    @Post('message')
    async createMessage(@Body('sessionName') sessionName: String, @Body('message') message: String, @Body('sender') sender: String ,@Body('type') type: String){
        return await this.messageService.createMessage(sessionName,message,sender);
    }

    @Get('message')
    async getMessage(@Body('sessionName') sessionName: String){
        return await this.messageService.findBySessionName(sessionName);
    }


}