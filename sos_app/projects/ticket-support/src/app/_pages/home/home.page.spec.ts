import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HomePage } from './home.page';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { APP_CONFIG } from 'shared';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from 'shared';
import { of } from 'rxjs';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HomePage, RouterTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideIonicAngular(),
        { provide: APP_CONFIG, useValue: { reverbKey: 'test-key', wsHost: 'localhost', wsPort: 6001, wsScheme: 'ws' } },
        { provide: LoginService, useValue: { logout: jasmine.createSpy('logout').and.returnValue(of(null)) } }
      ]
    });
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
