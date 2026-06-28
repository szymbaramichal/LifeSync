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
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ProfileService } from '../profile.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  imports: [
    MatCard,
    MatButton,
    MarkdownPipe,
    AsyncPipe,
    MatIcon,
    MarkdownEditorComponent,
    MatSlideToggle,
    ReactiveFormsModule
  ],
  templateUrl: './me.html',
  styleUrl: './me.css',
})
export class Me {
  authService = inject(AuthService);
  profileService = inject(ProfileService);
  router = inject(Router);
  private snackBar = inject(MatSnackBar);

  me = input.required<MeDto>();
  editMode = signal<boolean>(false);
  currentMarkdown = signal<string>('');
  isLoading = signal<boolean>(false);

  updateForm = new FormGroup({
    description: new FormControl('')
  });

  constructor() {
    afterNextRender(() => {
      const description = this.me().description || '';
      this.currentMarkdown.set(description);
      this.updateForm.patchValue({ description });
    });
  }

  async onLogout() {
    await this.authService.logout();
    this.router.navigate(['auth']);
  }

  onToggleEditMode(checked: boolean) {
    this.editMode.set(checked);
    if (!checked) {
      // Revert the form control to last saved markdown value if user toggles off
      this.updateForm.patchValue({ description: this.currentMarkdown() });
    } else {
      // Ensure the form control is initialized with current markdown value
      this.updateForm.patchValue({ description: this.currentMarkdown() });
    }
  }

  onUpdate() {
    if (this.updateForm.invalid) return;

    this.isLoading.set(true);
    const updatedDescription = this.updateForm.value.description || '';

    this.profileService.updateProfile({ description: updatedDescription }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.currentMarkdown.set(response.description || '');
        this.editMode.set(false);
        this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
        this.profileService.refreshProfile();
      },
      error: () => {
        this.isLoading.set(false);
        this.snackBar.open('Failed to update profile', 'Close', { duration: 3000 });
      }
    });
  }
}
