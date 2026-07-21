import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UserModalComponent } from './user-modal.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MaskitoDirective } from '@maskito/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { provideIonicAngular } from '@ionic/angular/standalone';

describe('UserModalComponent', () => {
  let component: UserModalComponent;
  let fixture: ComponentFixture<UserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaskitoDirective, ReactiveFormsModule, UserModalComponent],
      providers: [
        provideIonicAngular(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
