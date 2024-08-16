import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActiveUserService } from './services/activeUser/activeUser.service';

export const authGuard: CanActivateFn = (route, state) => {
  const activeUserService = inject(ActiveUserService);
  const router = inject(Router);

  if (activeUserService.isLoggedIn()) {
    return true; // Allow access to the route
  } else {
    router.navigate(['/login']); // Redirect to login if not authenticated
    return false; // Block access to the route
  }
};
