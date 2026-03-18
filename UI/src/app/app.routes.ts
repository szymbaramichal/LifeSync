import { Routes } from '@angular/router';
import { Me } from './user/profile/me/me';
import { CreateProfile } from './user/profile/create-profile/create-profile';
import { Auth } from './auth/auth/auth';
import { MainLayout } from './layouts/main-layout/main-layout';
import { authGuard } from './core/guards/auth.guard';
import { NotFound } from './not-found/not-found';
import { guestGuard } from './core/guards/guest.guard';
import { Dashboard } from './dashboard/dashboard';
import { meResolver } from './core/resolvers/me.resolver';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'auth', component: Auth, canActivate: [guestGuard] },
  { path: 'create-profile', component: CreateProfile, canActivate: [authGuard] },
  {
    path: 'dashboard',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', component: Dashboard },
      { path: 'me', component: Me, resolve: { me: meResolver } },
    ]
  },
  { path: '**', component: NotFound  },
];
