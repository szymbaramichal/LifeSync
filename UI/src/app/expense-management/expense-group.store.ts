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
  readonly pendingGroups = signal<ExpenseGroupDto[]>([]);

  ensureLoaded(): void {
    if (this.loaded || this.loading) return;

    this.loading = true;
    this.expenseGroupsService.getExpenseGroups().subscribe(groups => {
      this.groups.set(groups.filter(x => !x.isPendingInvitation));
      this.pendingGroups.set(groups.filter(x => x.isPendingInvitation));

      this.loading = false;
      this.loaded = true;
    });
  }

  refresh(): void {
    this.loaded = false;
    this.ensureLoaded();
  }

  acceptInvitation(groupId: string): void {
    this.expenseGroupsService.changeExpenseGroupInvitationState(groupId, 'accept').subscribe(() => {
      this.refresh();
    });
  }

  declineInvitation(groupId: string): void {
    this.expenseGroupsService.changeExpenseGroupInvitationState(groupId, 'decline').subscribe(() => {
      this.refresh();
    });
  }
}
