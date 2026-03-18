import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateProfileRequest, CreateProfileResponse, MeResponse } from './profile.models';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private httpClient = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  me(): Observable<MeResponse> {
    return this.httpClient.get<MeResponse>(this.baseUrl + '/api/users/me');
  }

  createProfile(request: CreateProfileRequest): Observable<CreateProfileResponse> {
    return this.httpClient.post<CreateProfileResponse>(this.baseUrl + '/api/users/profile', request);
  }
}
