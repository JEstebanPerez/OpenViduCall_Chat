import {SessionModule} from "./Session/session.module";
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { Module } from '@nestjs/common';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/OpenVidu', { useFindAndModify: false }),
    SessionModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { 

}