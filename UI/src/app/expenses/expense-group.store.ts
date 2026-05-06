import { inject, Injectable, signal } from '@angular/core';
import { ExpensesService } from './expenses.service';
import { ExpenseGroupDto } from './expenses.models';

@Injectable({
  providedIn: 'root',
})
export class ExpenseGroupStore {
  private expenseService = inject(ExpensesService);
  private loading = false;
  private loaded = false;

  readonly groups = signal<ExpenseGroupDto[]>([]);

  ensureLoaded(): void {
    if (this.loaded || this.loading) return;

    this.loading = true;
    this.expenseService.getExpenseGroups().subscribe(groups => {
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
