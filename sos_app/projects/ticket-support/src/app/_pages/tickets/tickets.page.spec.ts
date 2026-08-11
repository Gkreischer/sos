import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TicketsPage } from './tickets.page';
import { ModalService } from 'projects/shared/src/lib/_services/modal.service';
import { NotificationService } from 'projects/shared/src/lib/_services/notification.service';
import { TicketService } from 'projects/shared/src/lib/_services/ticket.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { of } from 'rxjs';

describe('TicketsPage', () => {
  let component: TicketsPage;
  let fixture: ComponentFixture<TicketsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TicketsPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideIonicAngular(),
        {
          provide: ModalService,
          useValue: { openModal: jasmine.createSpy('openModal') },
        },
        { provide: NotificationService, useValue: {} },
        {
          provide: TicketService,
          useValue: {
            getUserTickets: jasmine
              .createSpy('getUserTickets')
              .and.returnValue(of([])),
          },
        },
      ],
    });
    fixture = TestBed.createComponent(TicketsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
