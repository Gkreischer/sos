import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalAddPartComponent } from './modal-add-part.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ModalAddPartComponent', () => {
  let component: ModalAddPartComponent;
  let fixture: ComponentFixture<ModalAddPartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ModalAddPartComponent],
    providers: [provideHttpClient(), provideHttpClientTesting()],
}).compileComponents();

    fixture = TestBed.createComponent(ModalAddPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
