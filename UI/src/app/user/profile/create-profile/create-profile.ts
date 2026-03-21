import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProfileService } from '../profile.service';
import { Router } from '@angular/router';
import { CreateProfileRequest } from '../profile.models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './create-profile.html',
  styleUrls: ['./create-profile.css']
})
export class CreateProfile {
  private profileService = inject(ProfileService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  isLoading = signal(false);

  profileForm: FormGroup = this.fb.nonNullable.group({
    displayName: ['', [Validators.required, Validators.minLength(3)]]
  });

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading.set(true);

      const request: CreateProfileRequest = {
        displayName: this.profileForm.value.displayName
      };

      this.profileService.createProfile(request).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.profileForm.reset();
          this.snackBar.open('Profile created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard/me']);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }
}
