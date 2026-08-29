import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  currentYear = new Date().getFullYear();

  // =========================================================
  // ADMIN CREDENTIALS
  // =========================================================

  private readonly ADMIN_USERNAME = '@maxtours';
  private readonly ADMIN_PASSWORD = 'admin@Maxtours2026';


  // =========================================================
  // FORM DATA
  // =========================================================

  username = '';
  password = '';

  showPassword = false;

  isLoggingIn = false;


  // =========================================================
  // LOGIN MESSAGE
  // =========================================================

  loginMessage = '';

  loginMessageType: 'success' | 'error' | '' = '';


  constructor(
    private router: Router
  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    const loggedIn =
      localStorage.getItem('max_admin_logged_in');

    if (loggedIn === 'true') {

      this.router.navigate(['/admin']);

    }

  }


  // =========================================================
  // TOGGLE PASSWORD
  // =========================================================

  togglePassword(): void {

    this.showPassword = !this.showPassword;

  }


  // =========================================================
  // LOGIN
  // =========================================================

  login(): void {

    const trimmedUsername =
      this.username.trim();


    // Clear previous message
    this.loginMessage = '';
    this.loginMessageType = '';


    // Basic validation
    if (!trimmedUsername || !this.password) {

      this.loginMessage =
        'Please enter your username and password.';

      this.loginMessageType = 'error';

      return;

    }


    this.isLoggingIn = true;


    // Small premium UX delay
    setTimeout(() => {

      if (
        trimmedUsername === this.ADMIN_USERNAME &&
        this.password === this.ADMIN_PASSWORD
      ) {

        // Save authentication state
        localStorage.setItem(
          'max_admin_logged_in',
          'true'
        );

        localStorage.setItem(
          'max_admin_user',
          trimmedUsername
        );


        this.loginMessage =
          'Login successful. Opening admin panel...';

        this.loginMessageType = 'success';


        // Redirect
        setTimeout(() => {

          this.router.navigate(['/admin']);

        }, 700);


      } else {

        this.isLoggingIn = false;

        this.loginMessage =
          'Invalid username or password.';

        this.loginMessageType = 'error';

      }

    }, 500);

  }

}