import { Component, effect, inject, OnInit, output } from '@angular/core';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ExpenseGroupStore } from '../../../expense-group.store';

@Component({
  selector: 'app-group-selector',
  imports: [
    MatSelect,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './group-selector.html',
  styleUrl: './group-selector.css',
})
export class GroupSelector implements OnInit {
  expenseGroupChanged = output<string>();
  expenseGroupStore = inject(ExpenseGroupStore);

  selectedExpenseGroupId: string = '';

  constructor() {
    effect(() => {
      const selected = this.expenseGroupStore.selectedGroup();
      const newId = selected ? selected.id : '';
      if (newId !== this.selectedExpenseGroupId) {
        this.selectedExpenseGroupId = newId;
        this.expenseGroupChanged.emit(newId);
      }
    });
  }

  ngOnInit(): void {
    this.expenseGroupStore.refresh();
  }

  onSelectedExpenseGroupIdChange(groupId: string): void {
    if (groupId === 'create' || groupId === 'join') {
      this.expenseGroupChanged.emit(groupId);
    } else {
      this.expenseGroupStore.selectGroupById(groupId ?? '');
      this.expenseGroupChanged.emit(groupId ?? '');
    }
  }
}
