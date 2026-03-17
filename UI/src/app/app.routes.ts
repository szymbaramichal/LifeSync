import { Routes } from '@angular/router';
import { Profile } from './user/profile/profile/profile';
import { CreateProfile } from './user/profile/create-profile/create-profile';
import { Auth } from './auth/auth/auth';
import { MainLayout } from './layouts/main-layout/main-layout';
import { authGuard } from './core/guards/auth.guard';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'auth', component: Auth },
  { path: 'create-profile', component: CreateProfile },
  {
    path: 'dashboard',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: 'profile', component: Profile },
    ]
  },
  { path: '**', component: NotFound  },
];
