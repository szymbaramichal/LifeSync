import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  email = '';
  password = '';
  private authService = inject(AuthService);

  async register() {
    const user = await this.authService.register(this.email, this.password);
    if (user) {
      console.log(user);
    }
    else {
      console.log('user is null')
    }

  }
}
