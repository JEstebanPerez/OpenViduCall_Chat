import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {SessionSchema} from "../Schemas/session.schema";
import {MessageSchema} from "../Schemas/message.schema";
import {SessionService} from "../Providers/Session/session.service";
import {MessageService} from "../Providers/Message/message.service";
import {FilesController} from "./files.controller";

@Module(
    {imports: [MongooseModule.forFeature([,
            { name: 'Session', schema: SessionSchema },
            { name: 'Message', schema: MessageSchema }])],
        controllers: [FilesController],
        providers: [SessionService, MessageService]})
export class FilesModule {}
