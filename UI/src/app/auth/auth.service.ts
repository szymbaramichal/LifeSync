import { DestroyRef, Injectable, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
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
import { inject } from '@angular/core/primitives/di';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth;
  currentUser = signal<User | null>(null);
  destroyRef = inject(DestroyRef);

  constructor() {
    const app = initializeApp(environment.firebase);
    this.auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(this.auth, (user) => {
      console.log('changed user', user);
      this.currentUser.set(user);
    });

    this.destroyRef.onDestroy(() => unsubscribe());
  }

  async register(email: string, pass: string) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, pass);
    if (cred.user) {
      await sendEmailVerification(cred.user);
    }
    return cred.user;
  }

  async login(email: string, pass: string) {
    const cred = await signInWithEmailAndPassword(this.auth, email, pass);
    return cred.user;
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
}
