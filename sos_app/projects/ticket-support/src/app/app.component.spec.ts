import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideRouter } from '@angular/router';
import { APP_CONFIG } from '../../../shared/src/lib/config/app.config';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../../../shared/src/lib/_services/error.service';
import { PreferencesPluginService } from '../../../shared/src/lib/_services/preferences-plugin.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/src/lib/_services/notification.service';
import { LoginService } from '../../../shared/src/lib/_services/login.service';
import { of } from 'rxjs';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(waitForAsync(() => {
    const httpClient = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    const errorService = jasmine.createSpyObj('ErrorService', ['handleError']);
    const preferencesPluginService = {};
    const router = jasmine.createSpyObj('Router', ['navigate']);
    const notificationService = jasmine.createSpyObj('NotificationService', ['listen']);

    TestBed.configureTestingModule({
      imports: [AppComponent, IonicModule.forRoot()],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideIonicAngular(),
        provideRouter([]),
        {
          provide: APP_CONFIG,
          useValue: {
            baseUrl: 'http://localhost:3000',
            reverbPort: 8080,
            reverbHost: 'localhost',
            reverbKey: 'test-key',
            wsPort: 6001,
            wsHost: 'localhost',
            wsScheme: 'ws',
            authEndpoint: '/sanctum/token',
          },
        },
        { provide: HttpClient, useValue: httpClient },
        { provide: ErrorService, useValue: errorService },
        { provide: PreferencesPluginService, useValue: preferencesPluginService },
        { provide: Router, useValue: router },
        { provide: NotificationService, useValue: notificationService },
        // LoginService will be created by the injector using the above providers
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});