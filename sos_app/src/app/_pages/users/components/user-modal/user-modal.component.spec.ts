import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserModalComponent } from './user-modal.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MaskitoDirective } from '@maskito/angular';
import { ReactiveFormsModule } from '@angular/forms';

describe('UserModalComponent', () => {
  let component: UserModalComponent;
  let fixture: ComponentFixture<UserModalComponent>;

  beforeEach(waitForAsync(async () => {
    TestBed.configureTestingModule({
      declarations: [UserModalComponent],
      imports: [IonicModule.forRoot(), MaskitoDirective, ReactiveFormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
