import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UserFilterComponent } from './user-filter.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
describe('UserFilterComponent', () => {
  let component: UserFilterComponent;
  let fixture: ComponentFixture<UserFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFilterComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a filter button', () => {
    const filterButton = fixture.debugElement.query(
      By.css('[data-cy="user-filter"] ion-button'),
    );

    expect(filterButton).toBeTruthy();
  });

  it('should call searchUser when button is clicked', () => {
    const spy = spyOn(component, 'searchUser');

    const button = fixture.debugElement.query(
      By.css('[data-cy="user-filter"] ion-button'),
    );

    button.triggerEventHandler('click');

    expect(spy).toHaveBeenCalled();
  });
});
