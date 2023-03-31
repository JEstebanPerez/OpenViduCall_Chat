import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {SessionSchema} from "../Schemas/session.schema";
import {SessionService} from "../Providers/Session/session.service";
import {SessionController} from "./session.controller";

@Module(    {imports: [MongooseModule.forFeature([
        { name: 'Session', schema: SessionSchema }])],
    controllers: [SessionController],
    providers: [SessionService]})
export class SessionModule {}
