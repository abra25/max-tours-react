import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  readonly currentYear = new Date().getFullYear();

  email = '';
  password = '';
  showPassword = false;
  isLoggingIn = false;
  loginMessage = '';
  loginMessageType: 'success' | 'error' | '' = '';

  constructor(
    private readonly router: Router,
    private readonly adminAuth: AdminAuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  async login(): Promise<void> {
    if (this.isLoggingIn) return;

    const email = this.email.trim();
    this.loginMessage = '';
    this.loginMessageType = '';

    if (!email || !this.password) {
      this.loginMessage = 'Please enter your admin email and password.';
      this.loginMessageType = 'error';
      this.cdr.markForCheck();
      return;
    }

    this.isLoggingIn = true;
    this.cdr.markForCheck();

    // Phase 1: Supabase sign-in + admin membership verification.
    // Do not confuse navigation failures with invalid credentials.
    try {
      await this.adminAuth.signInAdmin(email, this.password);
    } catch (error: unknown) {
      console.error('Admin authentication failed:', error);
      const details = error instanceof Error ? error.message : String(error);
      this.loginMessage = /failed to fetch|networkerror|network request failed|timeout/i.test(details)
        ? 'Cannot reach Supabase. Check your network and try again.'
        : 'Unable to sign in. Verify admin email, password and account permissions.';
      this.loginMessageType = 'error';
      this.isLoggingIn = false;
      this.cdr.markForCheck();
      return;
    }

    // Phase 2: navigate. A broken Angular dev-server chunk is not a bad password.
    this.password = '';
    this.loginMessage = 'Authentication successful. Opening dashboard...';
    this.loginMessageType = 'success';
    this.cdr.markForCheck();

    try {
      const opened = await this.router.navigateByUrl('/admin', { replaceUrl: true });
      if (!opened || this.router.url.split(/[?#]/)[0] !== '/admin') {
        this.loginMessage = 'Signed in, but access to the admin dashboard was redirected. Check the admin session and permissions.';
        this.loginMessageType = 'error';
      }
    } catch (error: unknown) {
      console.error('Admin navigation failed after successful sign-in:', error);
      this.loginMessage =
        'Signed in successfully, but Angular could not open the dashboard. Keep npm start running, refresh, then open /admin.';
      this.loginMessageType = 'error';
    } finally {
      this.isLoggingIn = false;
      this.cdr.markForCheck();
    }
  }
}
