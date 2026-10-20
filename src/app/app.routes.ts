import { adminAuthGuard } from './auth/auth.guard';
import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Admin } from './auth/admin/admin';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home').then(m => m.Home)
  },

  {
    path: 'blog',
    loadComponent: () =>
      import('./blog/blog').then(m => m.Blog)
  },

  {
    path: 'blog-details/:slug',
    loadComponent: () =>
      import('./blog-details/blog-details').then(m => m.BlogDetails)
  },

  {
    path: 'booking',
    loadComponent: () =>
      import('./booking/booking').then(m => m.Booking)
  },

  {
    path: 'tours',
    loadComponent: () =>
      import('./tours/tours').then(m => m.Tours)
  },

  {
    path: 'tours/:slug',
    loadComponent: () =>
      import('./tours-details/tours-details').then(m => m.ToursDetails)
  },

   {
    path: 'destinations',
    loadComponent: () =>
      import('./destinations/destinations')
        .then(m => m.Destinations)
  },

  {
    path: 'destinations/:slug',
    loadComponent: () =>
      import('./destinations-details/destinations-details')
        .then(m => m.DestinationsDetails)
  },

   // ==========================================
  // LEGAL & INFORMATION
  // ==========================================

  {
    path: 'privacy',
    loadComponent: () =>
      import('./legal/privacy/privacy').then(m => m.Privacy)
  },

  {
    path: 'terms',
    loadComponent: () =>
      import('./legal/terms/terms').then(m => m.Terms)
  },

  {
    path: 'faqs',
    loadComponent: () =>
      import('./legal/faqs/faqs').then(m => m.Faqs)
  },


  // ADMIN
  {
    path: 'admin-login',
    component: Login
  },
  {
    path: 'admin',
    canActivate: [adminAuthGuard],
    component: Admin
  },

  {
    path: '**',
    redirectTo: ''
  }
];