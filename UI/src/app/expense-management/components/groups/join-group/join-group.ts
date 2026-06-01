import { Component, inject } from '@angular/core';
import { MatList, MatListItem } from '@angular/material/list';
import { ExpenseGroupStore } from '../../../expense-group.store';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-join-group',
  imports: [MatList, MatListItem, MatIcon, MatIconButton],
  templateUrl: './join-group.html',
  styleUrl: './join-group.css',
})
export class JoinGroup {
  expenseGroupsStore = inject(ExpenseGroupStore);

  constructor() {
    this.expenseGroupsStore.ensureLoaded();
  }

  onJoin(invitationId: string) {
    this.expenseGroupsStore.acceptInvitation(invitationId);
  }

  onDecline(invitationId: string) {
    this.expenseGroupsStore.declineInvitation(invitationId);
  }
}
