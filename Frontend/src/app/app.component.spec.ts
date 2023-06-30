import { TestBed, ComponentFixture } from "@angular/core/testing";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, SimpleChange} from "@angular/core";
import { AppComponent, FileDialogContent } from "./app.component";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { SessionService } from './services/session.service';
import { MessageService } from './services/message.service';
import { OpenViduAngularConfig, OpenViduAngularModule, ParticipantService, Signal } from "openvidu-angular";
import {mImage, message} from './Mocks/ComponentParameters'
import { ImageDialogContent } from "./imageDialog/imageDialog.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {PickerModule} from "@ctrl/ngx-emoji-mart";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {NgxDropzoneModule} from "ngx-dropzone";
import {MatButtonModule} from "@angular/material/button";
import {HttpClientModule} from "@angular/common/http";
import { OpenViduAngularConfigService } from "openvidu-angular/lib/services/config/openvidu-angular.config.service";
import { environment } from "src/environments/environment";

describe("AppComponent", () => {
  let componentApp: AppComponent;
  let componentFile: ImageDialogContent;
  let fixtureApp: ComponentFixture<AppComponent>;
  let fixtureFile: ComponentFixture<ImageDialogContent>;

  const config: OpenViduAngularConfig = {
  production: environment.production
  };
  
  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [ AppComponent, FileDialogContent, ImageDialogContent ],
      schemas:[CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers:[
        MessageService,
        SessionService,
        ParticipantService,
        MatDialog,
        {provide: DomSanitizer, useValue: {bypassSecurityTrustUrl: () => 'safeString'}},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ],
      imports:[
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
      ]
    })
    .compileComponents();

  });

  beforeEach(() => {

    fixtureApp = TestBed.createComponent(AppComponent);
    fixtureFile = TestBed.createComponent(ImageDialogContent);

    componentApp = fixtureApp.componentInstance;
    componentFile = fixtureFile.componentInstance;

  });

  it('should create the component', () => {
    expect(componentApp).toBeTruthy();
  });

  it('should initialize the sessionId', () => {
    expect(componentApp.sessionId).toBe('panel-directive-example');
  });

  it('should taken the cookie', ()=>{
    componentApp.checkCookie();
    expect(componentApp.cookie).not.toEqual("");
  })


  it('should recognise file type image',()=>{
    expect(componentApp.recogniseFileType("image/png")).toEqual(1);
  });

  it('should recognise file type other type',()=>{
    expect(componentApp.recogniseFileType("compressed;application/pdf")).toEqual(2);
  });

  it('should format Image', ()=>{
    componentApp.formatImage(mImage);
    expect(mImage).toBeDefined();
  });

  it('should not format Image', ()=>{
    componentApp.formatImage(message);
    expect(message['image']).toBeNull();
  });

  // Aquí puedes escribir más pruebas para verificar el comportamiento de tu componente

});
