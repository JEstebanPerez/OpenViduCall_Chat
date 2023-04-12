import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { Message } from '../models/message.model';
import { map } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private Api_url = environment.API_URL;

  constructor(private httpClient: HttpClient) { }

  createMessage(data:{sessionName:String, message:String, sender:String}){
      return this.httpClient.post(this.Api_url+"api/message",data).pipe(
          map(response => response as Message)
      )

  }

  getMessage(sessionName?: string) {
      let params = new HttpParams();
      if (sessionName) {
        params = params.append('sessionName', sessionName);
      }
      return this.httpClient.get(this.Api_url + 'api/message', { params }).pipe(
        map(response => response as Message[])
      );
    }

      
	sendFile(data: any) {
		return this.httpClient.post(this.Api_url+"api/files",data).pipe(
      map(response => response as Message)
  )
	}


    public sendMessage(socket:Socket, message: Message) {
      socket.emit("api/message", message);
    }
}