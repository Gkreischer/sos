import { TestBed } from '@angular/core/testing';
import { LoginService } from './login.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideRouter } from '@angular/router';
import { APP_CONFIG } from '../../../../shared/src/lib/config/app.config';
import { ErrorService } from './error.service';
import { PreferencesPluginService } from './preferences-plugin.service';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
        LoginService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideIonicAngular(),
        provideRouter([]),

        {
          provide: ErrorService,
          useValue: jasmine.createSpyObj('ErrorService', ['handleError']),
        },
        { provide: PreferencesPluginService, useValue: {} },
        {
          provide: NotificationService,
          useValue: jasmine.createSpyObj('NotificationService', ['listen']),
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate']),
        },
      ],
    });
    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
