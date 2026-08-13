import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { APP_CONFIG } from 'shared';
import { environment } from 'src/environments/environment';
describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: APP_CONFIG,
          useValue: {
            baseUrl: environment.baseUrl,
            reverbPort: environment.reverbPort,
            reverbHost: environment.reverbHost,
            reverbKey: environment.reverbKey,
            wsPort: environment.wsPort,
            wsHost: environment.wsHost,
            wsScheme: environment.wsScheme,
            authEndpoint: environment.authEndpoint,
          },
        },
        UserService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
