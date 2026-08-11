import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';

import { LoadingService } from './../_services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('loadingInterceptor called');
  const loadingService: LoadingService = inject(LoadingService);

  loadingService.show();

  return next(req).pipe(finalize(() => loadingService.hide()));
};