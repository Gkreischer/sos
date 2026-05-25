import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MetricFilterComponent } from './metric-filter.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MaskitoDirective } from '@maskito/angular';
import { ReactiveFormsModule } from '@angular/forms';

describe('MetricFilterComponent', () => {
  let component: MetricFilterComponent;
  let fixture: ComponentFixture<MetricFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MetricFilterComponent],
      imports: [IonicModule.forRoot(), MaskitoDirective, ReactiveFormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(MetricFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
