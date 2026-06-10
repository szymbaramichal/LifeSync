import { Component, DestroyRef, effect, inject, input, signal, untracked, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupRole, ExpenseGroupDetailsDto, ExpenseGroupMemberDto } from '../../../models/expense-groups.models';
import { ExpenseGroupsService } from '../../../services/expense-groups.service';
import { ExpenseGroupStore } from '../../../expense-group.store';

@Component({
  selector: 'app-group-settings',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './group-settings.html',
  styleUrl: './group-settings.css',
})
export class GroupSettings {
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar);
  private formBuilder = inject(FormBuilder);
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  private expenseGroupsService = inject(ExpenseGroupsService);
  expenseGroupStore = inject(ExpenseGroupStore);

  readonly GroupRole = GroupRole;

  inviteForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required]]
  });

  groupForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(50)]]
  });

  constructor() {
    effect(() => {
      const group = this.expenseGroupStore.selectedGroup();
      if (group) {
        this.groupForm.patchValue({ name: group.name }, { emitEvent: false });
      }
    });
  }

  onInviteUser(): void {
    const groupId = this.expenseGroupStore.selectedGroupId();
    if (!groupId || this.inviteForm.invalid) {
      return;
    }

    this.expenseGroupsService
      .inviteToExpenseGroup(groupId, { username: this.inviteForm.value.username.trim() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.inviteForm.reset();
          this.expenseGroupStore.refreshSelectedGroupDetails();
          this.snackBar.open('User invited!', 'Close', { duration: 5000 });
          this.formDirective.resetForm();
        }
      });
  }

  onDeleteUser(member: ExpenseGroupMemberDto): void {
    const groupId = this.expenseGroupStore.selectedGroupId();
    if (!groupId || member.groupRole === GroupRole.Owner) {
      return;
    }

    this.expenseGroupsService
      .removeMemberFromExpenseGroup(groupId, member.userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.expenseGroupStore.refreshSelectedGroupDetails();
          this.snackBar.open('User removed!', 'Close', { duration: 5000 });
        }
      });
  }

  onUpdateGroupName(): void {
    const group = this.expenseGroupStore.selectedGroup();
    const groupId = this.expenseGroupStore.selectedGroupId();
    if (!group || !groupId || this.groupForm.invalid) {
      return;
    }

    this.expenseGroupsService
      .updateExpenseGroup(groupId, {
        name: this.groupForm.value.name.trim(),
        isPrivate: group.isPrivate
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.expenseGroupStore.refresh();
          this.expenseGroupStore.refreshSelectedGroupDetails();
          this.snackBar.open('Group updated!', 'Close', { duration: 5000 });
        }
      });
  }
}
