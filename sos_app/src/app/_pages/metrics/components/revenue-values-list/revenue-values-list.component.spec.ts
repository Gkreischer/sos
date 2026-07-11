import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RevenueValuesListComponent } from './revenue-values-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

describe('RevenueValuesListComponent', () => {
  let component: RevenueValuesListComponent;
  let fixture: ComponentFixture<RevenueValuesListComponent>;

  beforeAll(() => {
    Chart.register(...registerables);
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [ BaseChartDirective, RevenueValuesListComponent],
    providers: [provideHttpClient(), provideHttpClientTesting()],
}).compileComponents();

    fixture = TestBed.createComponent(RevenueValuesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
