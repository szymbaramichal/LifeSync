import { Routes } from '@angular/router';
import { Me } from './user/profile/me/me';
import { CreateProfile } from './user/profile/create-profile/create-profile';
import { Auth } from './auth/auth/auth';
import { authGuard } from './core/guards/auth.guard';
import { NotFound } from './not-found/not-found';
import { guestGuard } from './core/guards/guest.guard';
import { Dashboard } from './dashboard/dashboard';
import { meResolver } from './core/resolvers/me.resolver';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { GuestLayout } from './layouts/guest-layout/guest-layout';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '',
    component: GuestLayout,
    children: [
      { path: 'auth', component: Auth, canActivate: [guestGuard] },
      { path: 'create-profile', component: CreateProfile, canActivate: [authGuard] },
    ]
  },
  {
    path: 'dashboard',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      { path: '', component: Dashboard },
      { path: 'me', component: Me, resolve: { me: meResolver } },
    ]
  },
  { path: '**', component: NotFound  },
];
