import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { RoomModalComponent } from './room-modal.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
describe('RoomModalComponent', () => {
  let component: RoomModalComponent;
  let fixture: ComponentFixture<RoomModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomModalComponent],
      providers: [
        provideIonicAngular(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoomModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
