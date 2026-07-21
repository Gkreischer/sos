import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UserInfoModalComponent } from './user-info-modal.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
describe('UserInfoModalComponent', () => {
  let component: UserInfoModalComponent;
  let fixture: ComponentFixture<UserInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInfoModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideIonicAngular(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserInfoModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
