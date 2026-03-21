import { Component } from '@angular/core';
import { SideBar } from '../components/side-bar/side-bar';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard-layout',
  imports: [SideBar, RouterOutlet, MatSidenavModule],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {

}
