import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { FirebaseError, initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
  Auth,
  sendEmailVerification,
} from 'firebase/auth';
import { environment } from '../../environments/environment';
import { AuthResultDto } from './auth.models';
import { LoadingService } from '../core/services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth;
  private _currentUser = signal<User | null>(null);
  private loadingService = inject(LoadingService);

  currentUser = this._currentUser.asReadonly();
  destroyRef = inject(DestroyRef);

  constructor() {
    const app = initializeApp(environment.firebase);
    this.auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(this.auth, (user) => {
      this._currentUser.set(user);
    });

    this.destroyRef.onDestroy(() => unsubscribe());
  }

  async register(email: string, pass: string): Promise<AuthResultDto> {
    this.loadingService.show();
    try {
      const cred = await createUserWithEmailAndPassword(this.auth, email, pass);
      if (cred.user) {
        await sendEmailVerification(cred.user);
        return {token: await cred.user.getIdToken()};
      }
      return { errorMessage: 'Something went wrong. Please try again later.' }
    } catch (e: any) {
      if (e instanceof FirebaseError) {
        if (e.code === 'auth/email-already-in-use') {
          return { errorMessage: 'Email already exists' };
        }
        else if (e.code === 'auth/weak-password') {
          return { errorMessage: 'Password must be at least 6 characters' };
        }
      }

      return { errorMessage: 'We could not register you. Please try again later.' }
    } finally {
      this.loadingService.hide();
    }
  }

  async login(email: string, pass: string): Promise<AuthResultDto> {
    this.loadingService.show();
    try {
      const cred = await signInWithEmailAndPassword(this.auth, email, pass);
      if (cred.user) {
        return {token: await cred.user.getIdToken()};
      }
      return { errorMessage: 'Something went wrong. Please try again later.' }
    } catch (e: any) {
      if (e instanceof FirebaseError) {
        console.log(e.code)
        if (e.code === 'auth/invalid-credential') {
          return { errorMessage: 'Invalid login and password' };
        }
      }

      return { errorMessage: 'We could not log you in. Please try again later.' }
    } finally {
      this.loadingService.hide();
    }
  }

  async logout() {
    await signOut(this.auth);
  }

  async getToken(): Promise<string | null> {
    let user = this.currentUser();
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  async isAuthenticated(): Promise<boolean> {
    await this.auth.authStateReady();
    return !!this._currentUser();
  }
}
