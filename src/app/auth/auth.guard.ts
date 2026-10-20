
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

export const adminAuthGuard: CanActivateFn = async () => {
  const adminAuth = inject(AdminAuthService);
  const router = inject(Router);

  try {
    const allowed = await adminAuth.isAdmin(true);

    if (allowed) {
      return true;
    }
  } catch (error) {
    console.error('Admin verification failed:', error);
  }

  return router.createUrlTree(['/admin-login']);
};
