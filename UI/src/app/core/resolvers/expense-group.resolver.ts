import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ExpenseGroupStore } from '../../expense-management/expense-group.store';

export const expenseGroupsResolver: ResolveFn<void> = () => {
  return inject(ExpenseGroupStore).ensureLoaded();
};
