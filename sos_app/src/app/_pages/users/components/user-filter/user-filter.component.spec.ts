import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UserFilterComponent } from './user-filter.component';

describe('UserFilterComponent', () => {
  let component: UserFilterComponent;
  let fixture: ComponentFixture<UserFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFilterComponent] // For standalone components, we can import directly
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a filter button', () => {
    const filterButton = fixture.debugElement.query(By.css('button'));
    expect(filterButton).toBeTruthy();
  });

  it('should call searchUser when button is clicked', () => {
    const spy = spyOn(component, 'searchUser');
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalled();
  });
});