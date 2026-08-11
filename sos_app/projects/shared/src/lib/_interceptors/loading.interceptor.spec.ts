import { loadingInterceptor } from './loading.interceptor';
import { TestBed } from '@angular/core/testing';
import { LoadingService } from '../_services/loading.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('loadingInterceptor', () => {
  let httpMock: HttpTestingController;
  let loadingService: LoadingService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideHttpClientTesting(),
        { provide: LoadingService, useValue: jasmine.createSpyObj('LoadingService', ['show', 'hide']) },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    loadingService = TestBed.inject(LoadingService);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call show and hide on request', () => {
    // Make an HTTP request to trigger the interceptor
    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    req.flush({});

    expect(loadingService.show).toHaveBeenCalled();
    expect(loadingService.hide).toHaveBeenCalled();
  });
});