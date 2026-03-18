import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private formBuilder = inject(FormBuilder);
  loginForm: FormGroup = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  async login() {
    const authResult = await this.authService.login(this.loginForm.value.email, this.loginForm.value.password);
    if (authResult.errorMessage) {
      this.snackBar.open(authResult.errorMessage, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    }
    else {
      this.loginForm.reset();
    }
  }
}
