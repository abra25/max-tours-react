import { Injectable } from '@angular/core';
import { supabaseClient } from '../lib/supabase';

/**
 * Supabase authentication and admin membership checks for Max Tours.
 *
 * The short-lived, in-memory cache only avoids immediate repeated checks
 * during login -> route guard -> Admin component initialization.
 * Real access to tables and Storage is enforced by Supabase RLS policies.
 */
@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly cacheDurationMs = 12_000;
  private verifiedAdmin: {
    userId: string;
    accessToken: string;
    checkedAt: number;
  } | null = null;

  private clearAdminVerification(): void {
    this.verifiedAdmin = null;
  }

  async isAdmin(forceServerCheck = false): Promise<boolean> {
    // First confirm that Supabase has a current session.
    const { data: { session }, error: sessionError } =
      await supabaseClient.auth.getSession();

    if (sessionError) {
      this.clearAdminVerification();
      throw sessionError;
    }

    if (!session?.user?.id) {
      this.clearAdminVerification();
      return false;
    }

    // Sign-in already verifies this exact session. Reuse its result briefly
    // so the route guard and Admin component do not repeat network requests.
    const cached = this.verifiedAdmin;
    if (
      !forceServerCheck &&
      cached?.userId === session.user.id &&
      cached.accessToken === session.access_token &&
      Date.now() - cached.checkedAt < this.cacheDurationMs
    ) {
      return true;
    }

    // getUser() validates the identity with the Supabase Auth server.
    const { data: { user }, error: userError } =
      await supabaseClient.auth.getUser();

    if (userError) {
      this.clearAdminVerification();
      if (userError.name === 'AuthSessionMissingError') return false;
      throw userError;
    }

    if (!user || user.id !== session.user.id) {
      this.clearAdminVerification();
      return false;
    }

    // Admin membership is checked server-side by the SQL function.
    const { data: allowed, error: roleError } =
      await supabaseClient.rpc('is_admin');

    if (roleError) {
      this.clearAdminVerification();
      throw roleError;
    }

    if (allowed !== true) {
      this.clearAdminVerification();
      return false;
    }

    this.verifiedAdmin = {
      userId: user.id,
      accessToken: session.access_token,
      checkedAt: Date.now()
    };
    return true;
  }

  async signInAdmin(email: string, password: string): Promise<void> {
    this.clearAdminVerification();

    const { error } = await supabaseClient.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    if (error) throw error;

    try {
      if (!(await this.isAdmin(true))) {
        throw new Error('This account is not registered as an administrator.');
      }
    } catch (verificationError) {
      this.clearAdminVerification();
      // A valid Supabase user who is not an admin must not retain a session.
      try {
        await supabaseClient.auth.signOut();
      } catch (signOutError) {
        console.error('Failed to clear rejected admin session:', signOutError);
      }
      throw verificationError;
    }
  }

  async currentAdminEmail(): Promise<string | null> {
    const { data: { session }, error } =
      await supabaseClient.auth.getSession();
    if (error || !session?.user) return null;
    return session.user.email ?? null;
  }

  async signOut(): Promise<void> {
    this.clearAdminVerification();
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  }
}
