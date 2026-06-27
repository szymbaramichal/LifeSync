import { afterNextRender, Component, inject, input, signal } from '@angular/core';
import { MeDto } from '../profile.models';
import { MatCard } from "@angular/material/card";
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { MarkdownPipe } from '../../../core/pipes/markdown.pipe';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from "@angular/material/icon";
import { MarkdownEditorComponent } from "../../../core/components/markdown-editor/markdown-editor";

@Component({
  selector: 'app-profile',
  imports: [MatCard, MatButton, MarkdownPipe, AsyncPipe, MatIcon, MarkdownEditorComponent],
  templateUrl: './me.html',
  styleUrl: './me.css',
})
export class Me {
  authService = inject(AuthService);
  router = inject(Router);
  me = input.required<MeDto>();
  editMode = signal<boolean>(true);
  currentMarkdown = signal<string>('');
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

  onMarkdownChange(newValue: string) {
    this.currentMarkdown.set(newValue);
    console.log("Markdown updated:", this.currentMarkdown);
  }
}
