import { Routes } from '@angular/router';
import { Profile } from './user/profile/profile/profile';
import { CreateProfile } from './user/profile/create-profile/create-profile';
import { Auth } from './auth/auth/auth';

export const routes: Routes = [
  { path: '', component: Profile },
  { path: 'auth', component: Auth },
  { path: 'profile', component: Profile },
  { path: 'create-profile', component: CreateProfile }
];
