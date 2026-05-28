import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TechnicianDataListComponent } from './technician-data-list.component';

describe('TechnicianDataListComponent', () => {
  let component: TechnicianDataListComponent;
  let fixture: ComponentFixture<TechnicianDataListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), TechnicianDataListComponent]
}).compileComponents();

    fixture = TestBed.createComponent(TechnicianDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
