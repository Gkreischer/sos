import { TestBed } from '@angular/core/testing';

import { UserTypeService } from './user-type.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UserTypeService', () => {
  let service: UserTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
