import {Body, Controller, Get, Logger, Param, Post, Put, Query} from '@nestjs/common';
import {MessageService} from "../Providers/Message/message.service";
import { CreateMessageDto } from 'src/DTOs/create-message-dto';
import { ObjectId } from 'mongoose';


@Controller('api')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    private logger : Logger = new Logger('MessageController')

    @Post('message')
    async createMessage(@Body('sessionName') sessionName: String, @Body('message') message: String, @Body('sender') sender: String ,@Body('type') type: String){
        return await this.messageService.createMessage(sessionName,message,sender,type);
    }

    @Get('message')
    async getMessage(@Query('sessionName') sessionName: String){
        if (sessionName){
            return await this.messageService.findBySessionName(sessionName);
        }else{
            return await this.messageService.findAll();
        }
        
    }



}