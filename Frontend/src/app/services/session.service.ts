import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { session } from '../models/session.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private Api_url = environment.API_URL;

  constructor(private httpClient: HttpClient) { }

  createSession(data:{sessionName:String}){
    return this.httpClient.post(this.Api_url+"api/session",data).pipe(
        map(response => response as session)
    )

  }


}