import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SideBar } from '../components/side-bar/side-bar';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    SideBar,
    RouterOutlet,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly isMobile = signal(false);
  readonly isSidebarOpened = signal(true);

  constructor() {
    this.breakpointObserver
      .observe('(max-width: 768px)')
      .pipe(takeUntilDestroyed())
      .subscribe((state) => {
        this.isMobile.set(state.matches);
        this.isSidebarOpened.set(!state.matches);
      });
  }

  toggleSidebar(): void {
    this.isSidebarOpened.update((opened) => !opened);
  }

  closeSidebarOnMobile(): void {
    if (this.isMobile()) {
      this.isSidebarOpened.set(false);
    }
  }

  onSidebarOpenedChange(opened: boolean): void {
    this.isSidebarOpened.set(opened);
  }
}
