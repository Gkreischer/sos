import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BarChartCounterComponent } from './bar-chart-counter.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BaseChartDirective } from 'ng2-charts';

import { Chart, registerables } from 'chart.js';

describe('BarChartCounterComponent', () => {
  let component: BarChartCounterComponent;
  let fixture: ComponentFixture<BarChartCounterComponent>;

  beforeAll(() => {
    Chart.register(...registerables);
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), BaseChartDirective, BarChartCounterComponent],
    providers: [provideHttpClient(), provideHttpClientTesting()],
}).compileComponents();

    fixture = TestBed.createComponent(BarChartCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
