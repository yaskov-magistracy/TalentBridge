import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard для авторизованных пользователей.
 * Перенаправляет на /candidate-dashboard если пользователь залогинен.
 */
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedInSync()) {
    router.navigateByUrl('/candidate-dashboard');
    return false;
  }

  return true;
};
