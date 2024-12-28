import { inject } from '@angular/core';
import { CanActivateFn, CanDeactivateFn } from '@angular/router';
import { AuthService } from '@services';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  // console.log("authService.isLoggedIn()1: ", authService.isLoggedIn());
  return authService.isLoggedIn();
};

export const nonLoginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  // console.log("authService.isLoggedIn()2: ", authService.isLoggedIn());
  return !authService.isLoggedIn();
}

// export const deActivateGuard: CanDeactivateFn<unknown> = (route, state) => {
//   return true;
// };
