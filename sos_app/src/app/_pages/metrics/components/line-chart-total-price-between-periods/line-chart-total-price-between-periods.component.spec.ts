import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LineChartTotalPriceBetweenPeriodsComponent } from './line-chart-total-price-between-periods.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BaseChartDirective } from 'ng2-charts';

import { Chart, registerables } from 'chart.js';

describe('LineChartTotalPriceBetweenPeriodsComponent', () => {
  let component: LineChartTotalPriceBetweenPeriodsComponent;
  let fixture: ComponentFixture<LineChartTotalPriceBetweenPeriodsComponent>;

  beforeAll(() => {
    Chart.register(...registerables);
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), BaseChartDirective, LineChartTotalPriceBetweenPeriodsComponent],
    providers: [provideHttpClient(), provideHttpClientTesting()],
}).compileComponents();

    fixture = TestBed.createComponent(
      LineChartTotalPriceBetweenPeriodsComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
