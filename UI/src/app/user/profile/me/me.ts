import { afterNextRender, Component, inject, input, signal } from '@angular/core';
import { MeDto } from '../profile.models';
import { MatCard } from "@angular/material/card";
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [MatCard, MatButton],
  templateUrl: './me.html',
  styleUrl: './me.css',
})
export class Me {
  authService = inject(AuthService);
  router = inject(Router);
  me = input.required<MeDto>();
  username = '';

  constructor() {
    afterNextRender(() => {
      this.username = this.me().username;
    });
  }

  async onLogout() {
    await this.authService.logout();
    this.router.navigate(['auth']);
  }
}
