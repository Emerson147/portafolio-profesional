import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home-page.component').then((m) => m.HomePageComponent),
  },
  {
    path: 'blog',
    loadComponent: () =>
      import('./pages/blog/blog-list-page.component').then((m) => m.BlogListPageComponent),
  },
  {
    path: 'blog/:slug',
    loadComponent: () =>
      import('./pages/blog/blog-detail-page.component').then((m) => m.BlogDetailPageComponent),
  },
  { path: '**', redirectTo: '' },
];
