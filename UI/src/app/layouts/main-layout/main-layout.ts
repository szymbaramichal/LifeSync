import { Component } from '@angular/core';
import { SideBar } from '../components/side-bar/side-bar';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-main-layout',
  imports: [SideBar, RouterOutlet, MatSidenavModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {

}
