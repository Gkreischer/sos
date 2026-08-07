import { TestBed } from '@angular/core/testing';
import { LoginService } from './login.service';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideRouter } from '@angular/router';
import { APP_CONFIG, AppConfig } from '../config/app.config';

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideIonicAngular(),
        provideRouter([]),
        {
          provide: APP_CONFIG,
          useValue: {
            reverbKey: 'test-key',
            wsHost: 'localhost',
            wsPort: 6001,
            wsScheme: 'ws',
          } as AppConfig,
        },
      ],
    });
    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
