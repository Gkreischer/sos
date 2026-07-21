import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BusinessInfoModalComponent } from './business-info-modal.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MaskitoDirective } from '@maskito/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { provideIonicAngular } from '@ionic/angular/standalone';

describe('BusinessInfoModalComponent', () => {
  let component: BusinessInfoModalComponent;
  let fixture: ComponentFixture<BusinessInfoModalComponent>;

  beforeAll(() => {
    Chart.register(...registerables);
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        
        MaskitoDirective,
        ReactiveFormsModule,
        BaseChartDirective,
        BusinessInfoModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideIonicAngular()],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
