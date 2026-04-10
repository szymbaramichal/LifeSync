import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [RouterLink, MatIcon],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar {

}
