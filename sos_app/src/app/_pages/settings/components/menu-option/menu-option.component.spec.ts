import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenuOptionComponent } from './menu-option.component';

describe('MenuOptionComponent', () => {
  let component: MenuOptionComponent;
  let fixture: ComponentFixture<MenuOptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), MenuOptionComponent]
}).compileComponents();

    fixture = TestBed.createComponent(MenuOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
