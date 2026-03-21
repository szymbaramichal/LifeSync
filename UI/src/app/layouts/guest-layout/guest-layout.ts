import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { MatToolbar } from "@angular/material/toolbar";

@Component({
  selector: 'app-guest-layout',
  imports: [RouterOutlet, MatToolbar],
  templateUrl: './guest-layout.html',
  styleUrl: './guest-layout.css',
})
export class GuestLayout {

}
