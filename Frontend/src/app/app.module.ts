import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { OpenViduAngularConfig, OpenViduAngularModule } from 'openvidu-angular';
import { environment } from 'src/environments/environment';

import {MatToolbarModule} from "@angular/material/toolbar";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {SocketIoModule, SocketIoConfig} from "ngx-socket-io";

import {FormsModule} from "@angular/forms";

const config: OpenViduAngularConfig = {
  production: environment.production
};
const configSocket: SocketIoConfig = { url: environment.API_URL, options:{}};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    MatButtonModule,
    OpenViduAngularModule.forRoot(config),
    SocketIoModule.forRoot(configSocket)

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
