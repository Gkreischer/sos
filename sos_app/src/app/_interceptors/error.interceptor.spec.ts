import { TestBed } from '@angular/core/testing';

import { errorInterceptor } from './error.interceptor';

describe('ErrorInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [errorInterceptor],
    }),
  );

  it('should be created', () => {
    const interceptor: typeof errorInterceptor =
      TestBed.inject(errorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
