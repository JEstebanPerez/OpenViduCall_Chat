import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FileDialogContent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { OpenViduAngularConfig, OpenViduAngularModule } from 'openvidu-angular';
import { environment } from 'src/environments/environment';

import {MatToolbarModule} from "@angular/material/toolbar";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {NgxDropzoneModule} from "ngx-dropzone";
import { ImageDialogContent } from './imageDialog/imageDialog.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import {FormsModule} from "@angular/forms";

const config: OpenViduAngularConfig = {
  production: environment.production
};

@NgModule({
  declarations: [
    ImageDialogContent,
    FileDialogContent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    PickerModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    MatButtonModule,
    NgxDropzoneModule,
    OpenViduAngularModule.forRoot(config),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
