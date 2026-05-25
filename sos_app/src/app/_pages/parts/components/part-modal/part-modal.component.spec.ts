import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PartModalComponent } from './part-modal.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MaskitoDirective } from '@maskito/angular';
import { ReactiveFormsModule } from '@angular/forms';

describe('PartModalComponent', () => {
  let component: PartModalComponent;
  let fixture: ComponentFixture<PartModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PartModalComponent],
      imports: [IonicModule.forRoot(), MaskitoDirective, ReactiveFormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(PartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
