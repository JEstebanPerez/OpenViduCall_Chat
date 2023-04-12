import {
    OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
    SubscribeMessage, WebSocketGateway, WebSocketServer
} from '@nestjs/websockets';
import {InternalServerErrorException, Logger} from '@nestjs/common';
import {Socket} from 'socket.io';
import {CreateMessageDto} from "../DTOs/create-message-dto";
import { SessionService } from '../Providers/Session/session.service';
import { MessageService } from 'src/Providers/Message/message.service';


@WebSocketGateway({
    transports: ['websocket', 'polling'],
    cors: {
        origin: "http://localhost:4200/*"
    }
})
export class ChatsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private sessionService: SessionService,
        private messageService: MessageService
    ) {
    }

    @WebSocketServer() server;
    private logger: Logger = new Logger('SessionGateway');

    afterInit(server) {
        this.sessionService.socket = server;
    }

    @SubscribeMessage('sendMessagePrivate')
    async sendMessagePrivate(client: Socket, message: CreateMessageDto) {
        try {
            this.logger.log('Send message to private chat participants');
            const chat = await this.chatsService.findOneGroupById(message.chatId)
            var data = {message: await this.messagesService.saveMessage(message), isPrivate: true};
            console.log(data)
            var user;
            user = await this.usersService.findOneByUsername(chat.participants);
            if (user.active) {
                this.server.to(user.socketId).emit('messageSent', data);
            }
            user = await this.usersService.findOneByUsername(chat.name);
            if (user.active) {
                this.server.to(user.socketId).emit('messageSent', data);
            }
        } catch (e: any) {
            throw new InternalServerErrorException();
        }
    }

    @SubscribeMessage('sendMessageGroup')
    async sendMessageGroup(client: Socket, message: CreateMessageDto) {
        try {
            this.logger.log('Send message to the participants of a group');
            let chat = await this.chatsService.findOneGroupById(message.chatId);
            var data = {message: await this.messagesService.saveMessage(message), isPrivate: false};
            this.logger.log(data)
            for (let i = 0; i < chat.participants.length; i++) {
                const user = await this.usersService.findOneByUsername(chat.participants[i]);
                this.logger.log(user);
                if (user.active) {
                    this.server.to(user.socketId).emit('messageSent', data);
                }
            }
        } catch (e: any) {
            throw new InternalServerErrorException();
        }
    }

    @SubscribeMessage('fileSentMessage')
    async sendFileReceived(client: Socket, data: any) {
        this.logger.log("Send message to participants that a new file is sent to the chat")
        this.logger.log(data)
        const chat = await this.chatsService.findOneGroupById(data[2]);
        if (chat.isPrivate) {
            var user = await this.usersService.findOneByUsername(chat.participants);
            if (user.active == true) this.server.to(user.socketId).emit('fileReceived', data[1]);
            user = await this.usersService.findOneByUsername(chat.name);
            if (user.active == true) this.server.to(user.socketId).emit('fileReceived', data[1]);
        } else {
            for (let i = 0; i < chat.participants.length; i++) {
                const user = await this.usersService.findOneByUsername(chat.participants[i]);
                if (user.active == true) {
                    console.log(user);
                    this.server.to(user.socketId).emit('fileReceived', data[1])
                }
            }
        }
    }

}
