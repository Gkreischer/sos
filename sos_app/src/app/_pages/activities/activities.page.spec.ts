import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivitiesPage } from './activities.page';
import { provideHttpClientTesting } from '@angular/common/http/testing';
describe('ActivitiesPage', () => {
  let component: ActivitiesPage;
  let fixture: ComponentFixture<ActivitiesPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(ActivitiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
