import { inject, Injectable, signal } from '@angular/core';
import { ExpenseGroupsService } from './services/expense-groups.service';
import { ExpenseGroupDto, ExpenseGroupDetailsDto } from './models/expense-groups.models';

@Injectable({
  providedIn: 'root',
})
export class ExpenseGroupStore {
  private expenseGroupsService = inject(ExpenseGroupsService);
  private loading = false;
  private loaded = false;

  private _selectedGroupId = signal<string>('');
  readonly selectedGroupId = this._selectedGroupId.asReadonly();

  private _selectedGroup = signal<ExpenseGroupDetailsDto | null>(null);
  readonly selectedGroup = this._selectedGroup.asReadonly();

  readonly groups = signal<ExpenseGroupDto[]>([]);
  readonly pendingGroups = signal<ExpenseGroupDto[]>([]);

  ensureLoaded(): void {
    if (this.loaded || this.loading) return;

    this.loading = true;
    this.expenseGroupsService.getExpenseGroups().subscribe(groups => {
      const activeGroups = groups.filter(x => !x.isPendingInvitation);
      this.groups.set(activeGroups);
      this.pendingGroups.set(groups.filter(x => x.isPendingInvitation));

      const currentId = this._selectedGroupId();
      let nextId = currentId;
      if (!currentId || !activeGroups.some(g => g.id === currentId)) {
        if (activeGroups.length > 0) {
          nextId = activeGroups[0].id;
        } else {
          nextId = '';
        }
        this._selectedGroupId.set(nextId);
      }

      const currentSelectedGroup = this._selectedGroup();
      if (!currentSelectedGroup || currentSelectedGroup.id !== nextId) {
        this.refreshSelectedGroupDetails();
      }

      this.loading = false;
      this.loaded = true;
    });
  }

  selectGroupById(groupId: string): void {
    if (this._selectedGroupId() === groupId) {
      return;
    }
    this._selectedGroupId.set(groupId);
    this.refreshSelectedGroupDetails();
  }

  refreshSelectedGroupDetails(): void {
    const id = this.selectedGroupId();
    if (id === '') {
      this._selectedGroup.set(null);
      return;
    }

    this.expenseGroupsService.getExpenseGroupById(id).subscribe((group) => {
      this._selectedGroup.set(group);
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
