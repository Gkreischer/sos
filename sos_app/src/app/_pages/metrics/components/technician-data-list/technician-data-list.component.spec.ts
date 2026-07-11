import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TechnicianDataListComponent } from './technician-data-list.component';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
describe('TechnicianDataListComponent', () => {
  let component: TechnicianDataListComponent;
  let fixture: ComponentFixture<TechnicianDataListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TechnicianDataListComponent],
      providers: [
        provideIonicAngular(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TechnicianDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
