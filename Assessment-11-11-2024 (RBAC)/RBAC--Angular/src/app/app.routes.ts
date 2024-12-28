import { Routes } from '@angular/router';
import { loginGuard, nonLoginGuard } from '@guards';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate:[loginGuard] },
  { path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule), canActivate: [nonLoginGuard] },
  { path: '**', redirectTo: '' }
];
