import {Body, Controller, Get, Logger, Param, Post, Put, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import {CreateMessageDto} from "../DTOs/create-message-dto";
import {ObjectId} from "mongoose";
import {MessageService} from "../Providers/Message/message.service";
import {SessionService} from "../Providers/Session/session.service";

@Controller('api/files')
export class FilesController {

    constructor(
        private readonly messageService: MessageService, private readonly sessionService:SessionService
    ) {}

    private logger: Logger = new Logger('FilesController');

    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file, @Body() body) {
        this.logger.log("Saving file...");
        console.log(file)
        let message = new CreateMessageDto(file.originalname, new Date(), body.sender,body.sessionName, (file.size > 50000)? "compressed;" +file.mimetype : file.mimetype, file.buffer)
        var data = await this.messageService.saveMessage(message);
        return data;
    }

    @Get(':fileId')
    async getFile(@Param('fileId') fileId:ObjectId) {
        this.logger.log("Asking for the file to receive it");
        const message = await this.messageService.getFile(fileId);
        const chat = await this.sessionService.findOneBySessionName(message.sessionName);
        return {message: message}
    }
}
