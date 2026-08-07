import { TestBed } from '@angular/core/testing';
import { TicketService } from './ticket.service';
import { provideHttpClient } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from '../config/app.config';

describe('TicketService', () => {
  let service: TicketService;

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
    service = TestBed.inject(TicketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
