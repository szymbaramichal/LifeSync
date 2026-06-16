import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateProfileRequest, CreateProfileResponse, MeDto, MeResponse } from './profile.models';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = environment.apiUrl;

  private _myProfile = signal<MeDto | null>(null);
  myProfile = this._myProfile.asReadonly();

  constructor() {
    effect(() => {
      if (!this.authService.currentUser()) {
        this.clearProfile();
      }
    });
  }

  me(): Observable<MeDto> {
    const cached = this._myProfile();
    if (cached) {
      return of(cached);
    }

    return this.httpClient.get<MeResponse>(this.baseUrl + '/api/users/me').pipe(
      tap((response) => {
        this._myProfile.set({
          id: response.id,
          username: response.username,
        });
      })
    );
  }

  createProfile(request: CreateProfileRequest): Observable<CreateProfileResponse> {
    return this.httpClient.post<CreateProfileResponse>(this.baseUrl + '/api/users/profile', request)
      .pipe(
        tap((response) => {
          this._myProfile.set({
            id: response.id,
            username: response.username,
          });
        })
      );
  }

  clearProfile(): void {
    this._myProfile.set(null);
  }
}
