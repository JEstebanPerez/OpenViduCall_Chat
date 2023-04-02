import {Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subscription, lastValueFrom } from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {DomSanitizer} from "@angular/platform-browser";
import { Session,  SignalOptions  } from "openvidu-browser";

import { ParticipantAbstractModel, ParticipantService, Signal, TokenModel } from "openvidu-angular";

@Component({
	selector: "app-root",
	templateUrl: './app.html',
	styleUrls: ['./app.scss',
				'./assets/customizable-chat-chatbox.scss']
})
export class AppComponent implements OnInit {

	APPLICATION_SERVER_URL = 'http://localhost:5000/';

	sessionId = "panel-directive-example";
	tokens!: TokenModel;
	session!: Session;
	localParticipant!: ParticipantAbstractModel;
	localParticipantSubs!: Subscription;
	localUserStreamManager: any;
	messages: String[] = [];

	constructor(private httpClient: HttpClient, public dialog: MatDialog, private domSanitizer: DomSanitizer, public sessionService: SessionService, private participantService: ParticipantService) { }


	async ngOnInit() {
		this.tokens = {
			webcam: await this.getToken(),
			screen: await this.getToken(),
		};
	}

	/**
	 * --------------------------------------------
	 * GETTING A TOKEN FROM YOUR APPLICATION SERVER
	 * --------------------------------------------
	 * The methods below request the creation of a Session and a Token to
	 * your application server. This keeps your OpenVidu deployment secure.
	 * 
	 * In this sample code, there is no user control at all. Anybody could
	 * access your application server endpoints! In a real production
	 * environment, your application server must identify the user to allow
	 * access to the endpoints.
	 * 
	 * Visit https://docs.openvidu.io/en/stable/application-server to learn
	 * more about the integration of OpenVidu in your application server.
	 */

	async getToken(): Promise<string> {
		const sessionId = await this.createSession(this.sessionId);
		return await this.createToken(sessionId);
	}

	onSessionCreated(session: Session) {
		console.log("JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ");
	}

	createSession(sessionId: string): Promise<string> {
		let data ={sessionName: sessionId};
		this.sessionService.createSession(data).subscribe(
			session => console.log("Create correctly"),
			error => console.error(error)
		)
		
		return lastValueFrom(this.httpClient.post(
			this.APPLICATION_SERVER_URL + 'api/sessions',
			{ customSessionId: sessionId },
			{ headers: { 'Content-Type': 'application/json' }, responseType: 'text' }
		));
	}

	createToken(sessionId: string): Promise<string> {
		return lastValueFrom(this.httpClient.post(
			this.APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections',
			{},
			{ headers: { 'Content-Type': 'application/json' }, responseType: 'text' }
		));
	}

	

	async subscribeToParticipants() {
		this.localParticipantSubs = this.participantService.localParticipantObs.subscribe((p) => {
		  this.localParticipant = p;
		});
		
		console.log("SOY: "+this.localParticipant.getNickname());
	  }


	joinSession(){
		
	}

	// NUEVO

	@Input() user: any;
	@Input() chatObs: any;

	files: File[] = [];
	
	public textArea = "";
	public isEmojiPickerVisible: boolean= true;
  


	openDialog() {
		const dialogRef = this.dialog.open(FileDialogContent);
		dialogRef.componentInstance.filesChange.subscribe(
		  data => {
			this.files = data;
			for (let i = 0; i < this.files.length; i++) {
			  const formData: FormData = new FormData();
			  formData.append('file', this.files[i], this.files[i].name);
			  formData.append('userName', this.user.userName as string);
			  formData.append('chatId', this.chatObs._id as string);
			  /*
			  this.chatboxService.sendFiles(this.listUrls[0], formData).subscribe(
				e => {
				  if (e != null) {
					this.chatboxService.fileSentMessage(this.socket, this.listUrls[3], e.sender, e._id, e.chatId);
				  }
				}
			  )*/
			}
		  }
		)
	  }

	  onSubmit() {
		
	  }

	  addEmoji(event: any) {
		this.textArea = `${this.textArea}${event.emoji.native}`;
		this.isEmojiPickerVisible = false;
	  }
	
}

import {Subject} from "rxjs";
import { SessionService } from "./services/session.service";
import { session } from "./models/session.model";

@Component({
  selector: 'cc-customizable-chat-chatbox-file-dialog',
  template: './file-dialog-content.component.html',
})

export class FileDialogContent {
	files: File[] = [];
	filesChange: Subject<File[]> = new Subject();
  
	onSelect(event: { addedFiles: any; }) {
	  console.log("On select")
	  this.files.push(...event.addedFiles);
	}
  
	onRemove(event: File) {
	  console.log("On remove");
	  this.files.splice(this.files.indexOf(event), 1);
	}
  
	sendFiles() {
	  this.filesChange.next(this.files);
	}
  }