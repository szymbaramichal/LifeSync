import { Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
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
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatListModule],
  templateUrl: './group-settings.html',
  styleUrl: './group-settings.css',
})
export class GroupSettings {
  groupId = input<string>('');
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar);
  private formBuilder = inject(FormBuilder);
  private expenseGroupsService = inject(ExpenseGroupsService);
  private expenseGroupStore = inject(ExpenseGroupStore);

  readonly GroupRole = GroupRole;
  groupDetails = signal<ExpenseGroupDetailsDto | null>(null);

  inviteForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required]]
  });

  groupForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(50)]]
  });

  constructor() {
    effect(() => {
      const selectedGroupId = this.groupId();

      if (!selectedGroupId) {
        this.groupDetails.set(null);
        return;
      }

      this.loadGroupDetails(selectedGroupId);
    });
  }

  onInviteUser(): void {
    const groupId = this.groupId();
    if (!groupId || this.inviteForm.invalid) {
      return;
    }

    this.expenseGroupsService
      .inviteToExpenseGroup(groupId, { username: this.inviteForm.value.username.trim() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.inviteForm.reset();
          this.loadGroupDetails(groupId);
          this.snackBar.open('User invited!', 'Close', { duration: 5000 });
        }
      });
  }

  onDeleteUser(member: ExpenseGroupMemberDto): void {
    const groupId = this.groupId();
    if (!groupId || member.groupRole === GroupRole.Owner) {
      return;
    }

    this.expenseGroupsService
      .removeMemberFromExpenseGroup(groupId, member.userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadGroupDetails(groupId);
          this.snackBar.open('User removed!', 'Close', { duration: 5000 });
        }
      });
  }

  onUpdateGroupName(): void {
    const group = this.groupDetails();
    const groupId = this.groupId();
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
          this.loadGroupDetails(groupId);
          this.snackBar.open('Group updated!', 'Close', { duration: 5000 });
        }
      });
  }

  private loadGroupDetails(groupId: string): void {
    this.expenseGroupsService
      .getExpenseGroupById(groupId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (groupDetails) => {
          this.groupDetails.set(groupDetails);
          this.groupForm.patchValue({ name: groupDetails.name }, { emitEvent: false });
        }
      });
  }
}
