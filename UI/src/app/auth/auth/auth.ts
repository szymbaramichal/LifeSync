import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Login } from '../login/login';
import { Register } from '../register/register';

@Component({
  selector: 'app-auth',
  imports: [ MatButtonModule, MatCardModule, MatToolbarModule, Login, Register],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  protected isLoginSelected = signal(true);

  toggleLogin() {
    this.isLoginSelected.set(!this.isLoginSelected());
  }
}
