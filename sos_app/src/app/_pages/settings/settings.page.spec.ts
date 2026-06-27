import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SettingsPage } from './settings.page';
import { provideHttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), SettingsPage],
      providers: [provideHttpClient()],
    });

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
