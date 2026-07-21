import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MenuOptionComponent } from './menu-option.component';
import { provideIonicAngular } from '@ionic/angular/standalone';
describe('MenuOptionComponent', () => {
  let component: MenuOptionComponent;
  let fixture: ComponentFixture<MenuOptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MenuOptionComponent],
      providers: [provideIonicAngular()],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
