import { TestBed } from '@angular/core/testing';

import { SettingService } from './setting.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('SettingService', () => {
  let service: SettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
