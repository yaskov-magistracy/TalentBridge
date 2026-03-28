import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard для авторизованных пользователей.
 * Перенаправляет на соответствующий дашборд в зависимости от роли.
 */
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedInSync()) {
    const userRole = authService.userRole();
    if (userRole === 'Candidate') {
      router.navigateByUrl('/candidate-dashboard');
    } else if (userRole === 'Employer') {
      router.navigateByUrl('/employer-dashboard');
    }
    return false;
  }

  return true;
};
