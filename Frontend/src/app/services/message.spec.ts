import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessageService } from './message.service';
import { environment } from '../../environments/environment';
import { Message } from '../models/message.model';

describe('MessageService', () => {
  let service: MessageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MessageService]
    });
    service = TestBed.inject(MessageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a message', () => {
    const messageData = {
      sessionName: 'Test Session',
      message: 'Test Message',
      sender: 'Test Sender'
    };

    service.createMessage(messageData).subscribe(message => {
      expect(message.sessionName).toBe(messageData.sessionName);
      expect(message.message).toBe(messageData.message);
      expect(message.sender).toBe(messageData.sender);
    });

    const req = httpMock.expectOne(environment.API_URL + 'api/message');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(messageData);
  });

  it('should get messages', () => {
    const sessionName = 'panel-directive-example';

    service.getMessage(sessionName).subscribe(messages => {
      expect(messages).toBeTruthy();
      expect(Array.isArray(messages)).toBe(true);
    });

    const req = httpMock.expectOne(environment.API_URL + 'api/message?sessionName=' + sessionName);
    expect(req.request.method).toBe('GET');
  });

  it('should update a message', () => {
    const updateData = {
      cookie: 'Test Cookie',
      sender: 'Test Sender'
    };

    service.updateMessage(updateData).subscribe(messages => {
      expect(messages).toBeTruthy();
      expect(Array.isArray(messages)).toBe(true);
    });

    const req = httpMock.expectOne(environment.API_URL + 'api/message');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);

  });

  it('should send a file', () => {
    const fileData = {} // Mock file data

    service.sendFile(fileData).subscribe(message => {
      expect(message).toBeTruthy();
    });

    const req = httpMock.expectOne(environment.API_URL + 'api/files');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(fileData);

  });

  it('should get a file', () => {
    const fileId = '12345';

    service.getFile(fileId).subscribe(file => {
      expect(file).toBeTruthy();
    });

    const req = httpMock.expectOne(environment.API_URL + 'api/files/' + fileId);
    expect(req.request.method).toBe('GET');

  });
});
