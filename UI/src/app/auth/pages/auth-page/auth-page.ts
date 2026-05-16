import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Login } from '../../components/login/login';
import { Register } from '../../components/register/register';

@Component({
  selector: 'app-auth-page',
  imports: [ MatButtonModule, MatCardModule, MatToolbarModule, Login, Register],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.css',
})
export class AuthPage {
  protected isLoginSelected = signal(true);

  toggleLogin() {
    this.isLoginSelected.set(!this.isLoginSelected());
  }
}
