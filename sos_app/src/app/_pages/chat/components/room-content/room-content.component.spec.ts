import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RoomContentComponent } from './room-content.component';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
describe('RoomContentComponent', () => {
  let component: RoomContentComponent;
  let fixture: ComponentFixture<RoomContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomContentComponent],
      providers: [
        provideIonicAngular(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoomContentComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
