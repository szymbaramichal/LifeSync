import { inject, Injectable, signal } from '@angular/core';
import { Observable, of, share } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ExpenseGroupsService } from './services/expense-groups.service';
import { ExpenseGroupDto, ExpenseGroupDetailsDto } from './models/expense-groups.models';
import { ExpenseDto } from './models/expenses.models';
import { ExpensesService } from './services/expenses.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseGroupStore {
  private expenseGroupsService = inject(ExpenseGroupsService);
  private expensesService = inject(ExpensesService);
  private loading = false;
  private loaded = false;
  private load$: Observable<void> | null = null;

  private _selectedGroupId = signal<string>('');
  readonly selectedGroupId = this._selectedGroupId.asReadonly();

  private _selectedGroup = signal<ExpenseGroupDetailsDto | null>(null);
  readonly selectedGroup = this._selectedGroup.asReadonly();

  readonly groups = signal<ExpenseGroupDto[]>([]);
  readonly pendingGroups = signal<ExpenseGroupDto[]>([]);

  private _expenses = signal<ExpenseDto[]>([]);
  readonly expenses = this._expenses.asReadonly();

  ensureLoaded(): Observable<void> {
    if (this.loaded) {
      return of(undefined);
    }

    if (this.loading && this.load$) {
      return this.load$;
    }

    this.loading = true;
    this.load$ = this.expenseGroupsService.getExpenseGroups().pipe(
      tap(groups => {
        const activeGroups = groups.filter(x => !x.isPendingInvitation);
        this.groups.set(activeGroups);
        this.pendingGroups.set(groups.filter(x => x.isPendingInvitation));

        const currentId = this._selectedGroupId();
        let nextId = currentId;
        if (!currentId || !activeGroups.some(g => g.id === currentId)) {
          nextId = activeGroups.length > 0 ? activeGroups[0].id : '';
          this._selectedGroupId.set(nextId);
        }

        const currentSelectedGroup = this._selectedGroup();
        if (!currentSelectedGroup || currentSelectedGroup.id !== this._selectedGroupId()) {
          this.refreshSelectedGroupDetails();
        }

        this.loading = false;
        this.loaded = true;
        this.load$ = null;
      }),
      map(() => undefined as void),
      share()
    ) as Observable<void>;

    return this.load$;
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
    this.load$ = null;
    this.ensureLoaded().subscribe();
  }

  refreshExpenses(): void {
    this.ensureLoaded().subscribe(() => {
      const id = this._selectedGroupId();
      if (!id) return;
      this.expensesService.getExpenses(id).subscribe(expenses => {
        this._expenses.set(expenses);
      });
    });
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
