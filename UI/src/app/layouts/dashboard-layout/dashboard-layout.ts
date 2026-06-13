import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SideBar } from '../components/side-bar/side-bar';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NotificationsService } from '../../core/services/notifications.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileService } from '../../user/profile/profile.service';

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
  private readonly profileService = inject(ProfileService);
  private notificationService = inject(NotificationsService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  readonly isMobile = signal(false);
  readonly isSidebarOpened = signal(true);

  constructor() {
    this.breakpointObserver
      .observe('(max-width: 768px)')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        this.isMobile.set(state.matches);
        this.isSidebarOpened.set(!state.matches);
      });

    effect(() => {
      const notification = this.notificationService.latest();
      if (notification) {
        this.snackBar.open('You have been invited to new expense group!', 'Close', {
          duration: 5000,
        });
      }
    })
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
