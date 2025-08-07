import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [NoAuthGuard],
    loadComponent: () =>
      import('./features/auth/page/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./layouts/layout/layout.component').then(
        (c) => c.LayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/page/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'members',
        loadComponent: () =>
          import('./features/members/page/members.component').then(
            (c) => c.MembersComponent
          ),
      },
      {
        path: 'plans',
        loadComponent: () =>
          import('./features/plans/page/plans.component').then(
            (c) => c.PlansComponent
          ),
      },
      {
        path: 'coaches',
        loadComponent: () =>
          import('./features/coaches/page/coaches.component').then(
            (c) => c.CoachesComponent
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/page/products.component').then(
            (c) => c.ProductsComponent
          ),
      },
      {
        path: 'product-types',
        loadComponent: () =>
          import('./features/product-types/page/product-types.component').then(
            (c) => c.ProductTypesComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/page/settings.component').then(
            (c) => c.SettingsComponent
          ),
      },
    ],
  },
];
