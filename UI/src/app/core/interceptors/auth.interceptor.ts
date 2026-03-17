import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return from(authService.getToken()).pipe(
    switchMap(token => {
      if (token) {
        req = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`),
        });
      }
      return next(req);
    })
  );
};
