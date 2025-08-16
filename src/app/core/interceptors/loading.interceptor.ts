import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  const isGetRequest = req.method.toUpperCase() === 'GET';

  if (isGetRequest) {
    loadingService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (isGetRequest) {
        loadingService.hide();
      }
    })
  );
};
