import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  registerForm: FormGroup = this.fb.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
  });

  private authService = inject(AuthService);

  async register() {
    if (this.registerForm.invalid)
      return;

    const authResult = await this.authService.register(this.registerForm.value.email,
      this.registerForm.value.password);

    if (authResult.errorMessage) {
      this.snackBar.open(authResult.errorMessage, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    }
    else {
      this.formDirective.resetForm();
      this.snackBar.open('Registration successful!', 'Close', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
    }
  }
}
