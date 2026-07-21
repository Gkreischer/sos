import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PostContentModalComponent } from './post-content.component';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
describe('PostContentModalComponent', () => {
  let component: PostContentModalComponent;
  let fixture: ComponentFixture<PostContentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostContentModalComponent],
      providers: [
        provideIonicAngular(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostContentModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
