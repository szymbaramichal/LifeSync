import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateProfileRequest, CreateProfileResult, MeResult } from './models/profile.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private httpClient = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  me(): Observable<MeResult> {
    return this.httpClient.get<MeResult>(this.baseUrl + '/api/users/me');
  }

  createProfile(request: CreateProfileRequest): Observable<CreateProfileResult> {
    return this.httpClient.post<CreateProfileResult>(this.baseUrl + '/api/users/profile', request);
  }
}
