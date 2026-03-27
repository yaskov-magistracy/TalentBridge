import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard для защищённых страниц (требует авторизации).
 * Перенаправляет на / если пользователь не залогинен.
 */
export const requireAuthGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedInSync()) {
    router.navigateByUrl('/');
    return false;
  }

  return true;
};
