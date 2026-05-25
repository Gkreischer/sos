import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CategoriesPage } from './categories.page';
import { IonicModule } from '@ionic/angular';

describe('CategoriesPage', () => {
  let component: CategoriesPage;
  let fixture: ComponentFixture<CategoriesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
    });
    fixture = TestBed.createComponent(CategoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
