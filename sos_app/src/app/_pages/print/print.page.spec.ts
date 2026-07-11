import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PrintPage } from './print.page';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
describe('PrintPage', () => {
  let component: PrintPage;
  let fixture: ComponentFixture<PrintPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(PrintPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
