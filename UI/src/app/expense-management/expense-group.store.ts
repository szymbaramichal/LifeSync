import { inject, Injectable, signal } from '@angular/core';
import { ExpenseGroupsService } from './services/expense-groups.service';
import { ExpenseGroupDto } from './models/expense-groups.models';

@Injectable({
  providedIn: 'root',
})
export class ExpenseGroupStore {
  private expenseGroupsService = inject(ExpenseGroupsService);
  private loading = false;
  private loaded = false;

  readonly groups = signal<ExpenseGroupDto[]>([]);

  ensureLoaded(): void {
    if (this.loaded || this.loading) return;

    this.loading = true;
    this.expenseGroupsService.getExpenseGroups().subscribe(groups => {
      this.groups.set(groups);
      this.loading = false;
      this.loaded = true;
    });
  }

  refresh(): void {
    this.loaded = false;
    this.ensureLoaded();
  }
}
