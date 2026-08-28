import { Routes } from '@angular/router';

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
  {
    path: 'admin-login',
    loadComponent: () =>
      import('./auth/login/login').then(
        m => m.Login
      )  
  },
  {
    path:'admin',
    loadComponent: () =>
      import('./auth/admin/admin').then(
        m => m.Admin
      )
  },

  {
    path: '**',
    redirectTo: ''
  }
];