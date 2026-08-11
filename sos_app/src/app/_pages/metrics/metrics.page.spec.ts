import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetricsPage } from './metrics.page';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
describe('MetricsPage', () => {
  let component: MetricsPage;
  let fixture: ComponentFixture<MetricsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricsPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideIonicAngular(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MetricsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
