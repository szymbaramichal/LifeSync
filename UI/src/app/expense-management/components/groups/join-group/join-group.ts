import { Component, inject } from '@angular/core';
import { MatList, MatListItem } from '@angular/material/list';
import { ExpenseGroupStore } from '../../../expense-group.store';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-join-group',
  imports: [MatList, MatListItem, MatIcon, MatIconButton],
  templateUrl: './join-group.html',
  styleUrl: './join-group.css',
})
export class JoinGroup {
  expenseGroupsStore = inject(ExpenseGroupStore);
  snackBar = inject(MatSnackBar);

  constructor() {
    this.expenseGroupsStore.ensureLoaded();
  }

  onJoin(invitationId: string) {
    this.expenseGroupsStore.acceptInvitation(invitationId);
    this.snackBar.open('You have joined new group', 'Close', {
      duration: 5000,
    });
  }

  onDecline(invitationId: string) {
    this.expenseGroupsStore.declineInvitation(invitationId);
    this.snackBar.open('Invitation declined', 'Close', {
      duration: 5000,
    });
  }
}
