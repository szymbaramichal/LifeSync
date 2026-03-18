import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const showDefaultError = () => {
    snackBar.open('Error has occurred. Please try again.', 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  };

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/auth']);
      }
      else if (error.status === 403) {
        router.navigate(['/create-profile']);
      }
      else if (error.status === 422) {
        const errors = error?.error?.errors;

        if (Array.isArray(errors) && errors.length > 0) {
          const errorMessages = errors.map((err: any) => err.errorMessage);

          for (const message of errorMessages) {
            snackBar.open(message, 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }

        } else {
          showDefaultError();
        }
      }
      else {
        showDefaultError();
      }

      return throwError(() => error);
    })
  );
};
