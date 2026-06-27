import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EquipmentsPage } from './equipments.page';
import { IonicModule } from '@ionic/angular';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('EquipmentsPage', () => {
  let component: EquipmentsPage;
  let fixture: ComponentFixture<EquipmentsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), EquipmentsPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(EquipmentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
