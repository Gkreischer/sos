import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UsersPage } from './users.page';
import { IonicModule } from '@ionic/angular';

describe('UsersPage', () => {
  let component: UsersPage;
  let fixture: ComponentFixture<UsersPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
    });
    fixture = TestBed.createComponent(UsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
