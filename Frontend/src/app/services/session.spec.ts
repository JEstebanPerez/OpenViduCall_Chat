import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SessionService } from './session.service';
import { environment } from '../../environments/environment';

describe('SessionService', () => {
  let service: SessionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionService]
    });
    service = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a session', () => {
    const sessionData = { sessionName: 'panel-test-example' };

    service.createSession(sessionData).subscribe(session => {
      expect(session.sessionName).toBe(sessionData.sessionName);
    });

    const req = httpMock.expectOne(environment.API_URL + 'api/session');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(sessionData);

    const mockSession = { sessionName: sessionData.sessionName };
    req.flush(mockSession);
  });
});
