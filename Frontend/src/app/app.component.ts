import {Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subscription, lastValueFrom } from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {DomSanitizer} from "@angular/platform-browser";
import {Socket} from "ngx-socket-io";
import { Session,  SignalOptions  } from "openvidu-browser";
import * as $ from "jquery";

import { ParticipantAbstractModel, ParticipantService, Signal, TokenModel } from "openvidu-angular";

@Component({
	selector: "app-root",
	templateUrl: './app.html',
	styleUrls: ['./app.scss',
				'./assets/customizable-chat-chatbox.scss']
})
export class AppComponent implements OnInit, OnChanges {

	APPLICATION_SERVER_URL = 'http://localhost:5000/';

	sessionId = "panel-directive-example";
	tokens!: TokenModel;
	messages: Message[] = [];
	user?:string;
	@Input() socket: Socket;

	constructor(private httpClient: HttpClient, public dialog: MatDialog, private domSanitizer: DomSanitizer, public sessionService: SessionService, public messageService: MessageService) { }


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
	createSession(sessionId: string): Promise<string> {
		let data ={sessionName: sessionId};
		this.sessionService.createSession(data).subscribe(
			session => console.log("Create correctly"),
			error => console.error(error)
		)

		this.messageService.getMessage(this.sessionId).subscribe(
			p => this.messages = p,
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


	// NUEVO

	files: File[] = [];
	
	public textArea = "";
	public isEmojiPickerVisible: boolean= true;
  

	ngOnChanges(changes: SimpleChanges): void {
		console.log("JJJJJJJJJJJJJJJJJJJJ "+changes);
	}


	openDialog() {
		const dialogRef = this.dialog.open(FileDialogContent);
		dialogRef.componentInstance.filesChange.subscribe(
		  data => {
			this.files = data;
			for (let i = 0; i < this.files.length; i++) {
			  const formData: FormData = new FormData();
			  formData.append('file', this.files[i], this.files[i].name);
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

	  startChat(){
		var nickname = document.getElementById("nickname");
		this.user = nickname!.textContent?.toString();
		document.getElementById("nickname-container")!.style.pointerEvents = "none"

		//Para focusear siempre el ultimo mensaje en el chat
		let upperElement = document.querySelector(".upper") as HTMLElement;
		let lastChild = upperElement.lastElementChild as HTMLElement;
		lastChild.scrollIntoView();
	  }
	  

	  onSubmit(message: String) {
		/*let data ={sessionName: this.sessionId, message: message, sender: this.user!};
		this.messageService.createMessage(data).subscribe(
			message => { this.textArea="", this.messages.push(message)
			} ,
			error => console.error(error)
		)*/

		const newMessage= new Message(this.sessionId, message, this.user!, "texto");

		this.messageService.sendMessage(this.socket,newMessage);
		

	  }

	  addEmoji(event: any) {
		this.textArea = `${this.textArea}${event.emoji.native}`;
		this.isEmojiPickerVisible = false;
	  }
	
}

import {Subject} from "rxjs";
import { SessionService } from "./services/session.service";
import { session } from "./models/session.model";
import { MessageService } from "./services/message.service";
import { Message } from "./models/message.model";

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