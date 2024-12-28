import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isLoggedIn = authService.isLoggedIn();
  !isLoggedIn && router.navigate(['login']);
  return isLoggedIn;
};

export const nonLoginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return !authService.isLoggedIn();
}

// export const deActivateGuard: CanDeactivateFn<unknown> = (route, state) => {
//   return true;
// };
