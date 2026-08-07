import { loadingInterceptor } from './loading.interceptor';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { LoadingService } from '../_services/loading.service';

describe('loadingInterceptor', () => {
  let httpMock: HttpTestingController;
  let loadingService: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        LoadingService,
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    loadingService = TestBed.inject(LoadingService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call show and hide on request', () => {
    spyOn(loadingService, 'show');
    spyOn(loadingService, 'hide');

    const req = httpMock.expectOne('http://localhost/test');
    req.flush({});

    expect(loadingService.show).toHaveBeenCalled();
    expect(loadingService.hide).toHaveBeenCalled();
  });
});
