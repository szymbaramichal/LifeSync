import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule, MatCardModule, MatToolbarModule, Login, Register],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('UI');
  protected isLoginSelected = signal(true);

  toggleLogin() {
    this.isLoginSelected.set(!this.isLoginSelected());
  }
}
