import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PieOrderByStatusBetweenPeriodsComponent } from './pie-order-by-status-between-periods.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

describe('PieOrderByStatusBetweenPeriodsComponent', () => {
  let component: PieOrderByStatusBetweenPeriodsComponent;
  let fixture: ComponentFixture<PieOrderByStatusBetweenPeriodsComponent>;

  beforeAll(() => {
    Chart.register(...registerables);
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [ BaseChartDirective, PieOrderByStatusBetweenPeriodsComponent],
    providers: [provideHttpClient(), provideHttpClientTesting()],
}).compileComponents();

    fixture = TestBed.createComponent(PieOrderByStatusBetweenPeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
