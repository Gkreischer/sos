import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PartFilterComponent } from './part-filter.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('PartFilterComponent', () => {
  let component: PartFilterComponent;
  let fixture: ComponentFixture<PartFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [ ReactiveFormsModule, PartFilterComponent],
    providers: [provideHttpClient(), provideHttpClientTesting()],
}).compileComponents();

    fixture = TestBed.createComponent(PartFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
