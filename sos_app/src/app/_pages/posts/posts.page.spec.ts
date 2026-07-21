import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostsPage } from './posts.page';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
describe('PostsPage', () => {
  let component: PostsPage;
  let fixture: ComponentFixture<PostsPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PostsPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideIonicAngular(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PostsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
