import { inject, Injectable } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard для защищённых страниц (требует авторизации).
 * Перенаправляет на соответствующий дашборд если пользователь не имеет доступа.
 */
export const requireAuthGuard = (allowedRole?: 'Candidate' | 'Employer'): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedInSync()) {
      router.navigateByUrl('/');
      return false;
    }

    // Если указана роль, проверяем её
    if (allowedRole) {
      const userRole = authService.userRole();
      if (userRole !== allowedRole) {
        // Перенаправляем на соответствующий дашборд
        if (userRole === 'Candidate') {
          router.navigateByUrl('/candidate-dashboard');
        } else if (userRole === 'Employer') {
          router.navigateByUrl('/employer-dashboard');
        }
        return false;
      }
    }

    return true;
  };
};
