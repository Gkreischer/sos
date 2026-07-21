import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PartModalComponent } from './part-modal.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MaskitoDirective } from '@maskito/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { provideIonicAngular } from '@ionic/angular/standalone';

describe('PartModalComponent', () => {
  let component: PartModalComponent;
  let fixture: ComponentFixture<PartModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MaskitoDirective, ReactiveFormsModule, PartModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideIonicAngular(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
