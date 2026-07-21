import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalAddPartComponent } from './modal-add-part.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
describe('ModalAddPartComponent', () => {
  let component: ModalAddPartComponent;
  let fixture: ComponentFixture<ModalAddPartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ModalAddPartComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideIonicAngular(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAddPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
