import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../config/app.config';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
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
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
