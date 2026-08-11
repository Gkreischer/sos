import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketsPage } from './tickets.page';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
describe('TicketsPage', () => {
  let component: TicketsPage;
  let fixture: ComponentFixture<TicketsPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideIonicAngular(),
      ],
    });
    fixture = TestBed.createComponent(TicketsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
