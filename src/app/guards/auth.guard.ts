import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const session = sessionStorage.getItem("AUTH_TOKE");
  if (session) {
    return true;
  }

  router.navigate(["/auth/login"]);
  return false;
};
