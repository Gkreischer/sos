import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PartsPage } from './parts.page';
import { IonicModule } from '@ionic/angular';

describe('PartsPage', () => {
  let component: PartsPage;
  let fixture: ComponentFixture<PartsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
    });
    fixture = TestBed.createComponent(PartsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
