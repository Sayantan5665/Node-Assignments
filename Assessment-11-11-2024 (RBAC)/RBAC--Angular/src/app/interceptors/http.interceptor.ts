import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '@services';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const token = storage.getToken() || '';

  let tokenizedReq = req.clone({
    headers: req.headers.set('auth-token', token)
  });

  return next(tokenizedReq);
};
