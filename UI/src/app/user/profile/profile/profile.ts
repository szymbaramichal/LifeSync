import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../profile.service';
import { MeDto } from '../models/profile.models';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private profileService = inject(ProfileService);
  private router = inject(Router);
  me = signal<MeDto>({} as MeDto);

  constructor() {
    this.profileService.me().subscribe({
      next: (data) => {
        this.me.set(data);
      },
      error: (error) => {
        if(error.status === 404) {
          this.router.navigate(['/create-profile']);
        }
      },
    });
  }
}
