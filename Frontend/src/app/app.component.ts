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
export class AppComponent implements OnInit {

	APPLICATION_SERVER_URL = 'http://localhost:5000/';

	sessionId = "panel-directive-example";
	tokens!: TokenModel;

	messages: Message[] = [];
	user?:string;

	nickname: boolean= false;
	

	localParticipant!: ParticipantAbstractModel;
	localParticipantSubs!: Subscription;

	session!: Session;
	cookie: string="";

	constructor(private httpClient: HttpClient, public dialog: MatDialog, private domSanitizer: DomSanitizer, public sessionService: SessionService, public messageService: MessageService, private participantService: ParticipantService) { }


	async ngOnInit() {
		this.tokens = {
			webcam: await this.getToken(),
			screen: await this.getToken(),
		};

		//Creador de Cookies
		this.cookie =this.getCookie("id");
		if(this.cookie==""){
			this.setCookie("id",Math.floor(Math.random() * 100000).toString(),2)
			this.cookie =this.getCookie("id");
		}

		

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
		this.session = session;

		
		this.session.on(`signal:CambioNombre`, (event: any) => {
			const e = JSON.parse(event.data);
			this.messages.forEach(m=>{
				if(m.cookie== e.cookie){
					m.sender= e.nickname;
				}
			})

		});

		this.session.on(`signal:${Signal.CHAT}`, (event: any) => {
			const msg = JSON.parse(event.data);
			if(msg.sender != this.user){
				this.messages.push(msg);
			}
		});

		//Notifica todos los cambios de nombre
		this.localParticipantSubs = this.participantService.localParticipantObs.subscribe((p) => {
			this.localParticipant = p;
			this.user=p.getNickname();
			this.enviar();
		});

	}


	createSession(sessionId: string): Promise<string> {
		let data ={sessionName: sessionId};
		this.sessionService.createSession(data).subscribe(
			session => console.log("Create correctly"),
			error => console.error(error)
		)

		this.messages= [];

		this.messageService.getMessage(this.sessionId).subscribe(
			p =>{ p.forEach(m => {
				if(m.type == "image/png" || m.type == "image/jpg" || m.type == "image/jpeg"){
					this.formatImage(m);
				}
				this.messages.push(m)
			})
			},
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
	public isEmojiPickerVisible: boolean= false;


	openDialog() {
		const dialogRef = this.dialog.open(FileDialogContent);
		let signalOptions: SignalOptions;
		dialogRef.componentInstance.filesChange.subscribe(
		  data => {
			this.files = data;
			for (let i = 0; i < this.files.length; i++) {
				const formData: FormData = new FormData();
				formData.append('file', this.files[i], this.files[i].name);
				formData.append('sender', this.user!);
				formData.append('sessionName', this.sessionId);
			  	this.messageService.sendFile(formData).subscribe(
				message => { this.textArea="";
					if(message.type == "image/png" || message.type == "image/jpg" || message.type == "image/jpeg"){
						this.formatImage(message);
					};
					this.messages.push(message);
					signalOptions = {
						data: JSON.stringify(message),
						type: Signal.CHAT,
						to: undefined,
					};
					this.session.signal(signalOptions);
				} ,
				error => console.error(error)
				)

				
			}
		  }
		)
	  }

	  recogniseFileType(type: String) {
		if (type == "message") {
		  return 0;
		} else if (type == "image/png" || type == "image/jpg" || type == "image/jpeg") {
		  return 1;
		} else {
		  return 2;
		}
	  }

	  openFile(response: any) {
		let checkCompressedImage = response.type.split(";");
		let blob;
		console.log(checkCompressedImage);
		if(checkCompressedImage[0] == "compressed"){
		  blob = new Blob([new Uint8Array(response.buffer.data)], {type: checkCompressedImage[1]});
		}else{
		  blob = new Blob([new Uint8Array(response.buffer.data)], {type: response.type});
		}
		const exportUrl = URL.createObjectURL(blob);
		window.open(exportUrl);
		URL.revokeObjectURL(exportUrl);
	  }


	  	// Event that opens an image "full screen"
		maximizeImage(image: any) {
			this.dialog.open(ImageDialogContent, {
			data: {image: image},
			});
		}

		// Formats images
		formatImage(img: any) {
			if (img.type == "image/jpeg" || img.type == "image/jpg" || img.type == "image/png") {
			  const base64String = btoa(new Uint8Array(img.buffer.data).reduce((data, byte) => {
				return data + String.fromCharCode(byte);
			  }, ''));
			  img.image = this.domSanitizer.bypassSecurityTrustUrl('data:' + img.type + ';base64, ' + base64String);
			} else {
			  img.image = null;
			}
		  }

	  startChat(){
		//Para focusear siempre el ultimo mensaje en el chat
		let upperElement = document.querySelector(".upper") as HTMLElement;
		let lastChild = upperElement.lastElementChild as HTMLElement;
		lastChild.scrollIntoView();
	  }


	  //Cuando pulsa el boton "Join session" comprueba si el nombre que ha introducido en el nickname es el mismo que los mensajes
	  joinSession(){
		const inputElement = document.getElementById("mat-input-0") as HTMLInputElement;
		const newNickName =inputElement.value;
		this.messages.forEach(m=>{
			if((m.cookie== this.cookie) && (m.sender != newNickName)){
				m.sender= newNickName;
			}
		})
	  }
	  
	  //Cada vez que se cambie de nombre el usuario enviara una peticion de update a la BBDD y una señal al resto de participantes
	  enviar(){

		let data ={cookie: this.cookie, sender: this.user! };
		this.messageService.updateMessage(data).subscribe(
			message => console.log("Éxito") ,
		error => console.error(error)
		)

		const signalOptions: SignalOptions = {
			data: JSON.stringify({ nickname: this.user, cookie:this.cookie}),
			type: "CambioNombre",
			to: undefined,
		};
		this.session.signal(signalOptions);
	  }

	  onSubmit(message: String): void {

		if(message!=""){
			let data ={sessionName: this.sessionId, message: message, sender: this.user!, type:"message", cookie: this.cookie};
			this.messageService.createMessage(data).subscribe(
				message => { this.textArea="", this.messages.push(message)
							} ,
			error => console.error(error)
		)

		const signalOptions: SignalOptions = {
			data: JSON.stringify({ sessionName: this.sessionId, message: message, sender: this.user!, type:"message", cookie: this.cookie }),
			type: Signal.CHAT,
			to: undefined,
		};
		this.session.signal(signalOptions);
		
		}
		
	  }

	  addEmoji(event: any) {
		this.textArea = `${this.textArea}${event.emoji.native}`;
		this.isEmojiPickerVisible = false;
	  }

	setCookie(name: string, value: string, days: number) {
		let expires = '';
		console.log("sssssssssss   "+value);
		if (days) {
		  const date = new Date();
		  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		  expires = '; expires=' + date.toUTCString();
		}
		document.cookie = name + '=' + value + expires + '; path=/';
	  }

	  getCookie(name: string) {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
		  const cookie = cookies[i].trim();
		  if (cookie.startsWith(name + '=')) {
			return cookie.substring(name.length + 1);
		  }
		}
		return "";
	  }
	  
	
}

import {Subject} from "rxjs";
import { SessionService } from "./services/session.service";
import { session } from "./models/session.model";
import { MessageService } from "./services/message.service";
import { Message } from "./models/message.model";
import { ImageDialogContent } from "./image-dialog-content/image-dialog-content.component";

@Component({
  selector: 'cc-customizable-chat-chatbox-file-dialog',
  templateUrl: "./file-dialog-content.component.html"
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