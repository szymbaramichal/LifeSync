import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private activeRequests = 0;
  private showDelayMs = 150;
  private minVisibleMs = 500;
  private shownAtMs: number | null = null;
  private showTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private hideTimeoutId: ReturnType<typeof setTimeout> | null = null;
  public isLoading = signal<boolean>(false);

  show() {
    this.activeRequests++;
    this.clearHideTimeout();

    if (this.activeRequests === 1 && !this.isLoading()) {
      this.clearShowTimeout();
      this.showTimeoutId = setTimeout(() => {
        if (this.activeRequests > 0) {
          this.shownAtMs = Date.now();
          this.isLoading.set(true);
        }
        this.showTimeoutId = null;
      }, this.showDelayMs);
    }
  }

  hide() {
    this.activeRequests--;

    if (this.activeRequests <= 0) {
      this.activeRequests = 0;
      this.clearShowTimeout();

      if (!this.isLoading()) {
        this.shownAtMs = null;
        return;
      }

      const shownAtMs = this.shownAtMs ?? Date.now();
      const elapsedMs = Date.now() - shownAtMs;
      const remainingMs = this.minVisibleMs - elapsedMs;

      if (remainingMs <= 0) {
        this.finishHiding();
        return;
      }

      this.clearHideTimeout();
      this.hideTimeoutId = setTimeout(() => {
        if (this.activeRequests === 0) {
          this.finishHiding();
        }
        this.hideTimeoutId = null;
      }, remainingMs);
    }
  }

  private clearShowTimeout(): void {
    if (this.showTimeoutId !== null) {
      clearTimeout(this.showTimeoutId);
      this.showTimeoutId = null;
    }
  }

  private clearHideTimeout(): void {
    if (this.hideTimeoutId !== null) {
      clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
  }

  private finishHiding(): void {
    this.isLoading.set(false);
    this.shownAtMs = null;
  }
}
