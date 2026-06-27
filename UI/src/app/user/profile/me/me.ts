import { afterNextRender, Component, inject, input, signal } from '@angular/core';
import { MeDto } from '../profile.models';
import { MatCard } from "@angular/material/card";
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { MarkdownPipe } from '../../../core/pipes/markdown.pipe';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-profile',
  imports: [MatCard, MatButton, MarkdownPipe, AsyncPipe, MatIcon],
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
