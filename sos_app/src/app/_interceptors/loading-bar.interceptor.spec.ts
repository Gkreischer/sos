import { TestBed } from '@angular/core/testing';

import { loadingBarInterceptor } from './loading-bar.interceptor';

describe('loadingBarInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [loadingBarInterceptor],
    }),
  );

  it('should be created', () => {
    const interceptor: typeof loadingBarInterceptor = TestBed.inject(
      loadingBarInterceptor,
    );
    expect(interceptor).toBeTruthy();
  });
});
