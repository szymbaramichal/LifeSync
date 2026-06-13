import { Component, computed, DestroyRef, effect, inject, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatInput } from '@angular/material/input';
import { CreateExpenseRequest } from '../../../models/expenses.models';
import { ExpensesService } from '../../../services/expenses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExpenseGroupStore } from '../../../expense-group.store';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SwitchOptions, TableUserShare } from './expenses-upsert.models';
import { ProfileService } from '../../../../user/profile/profile.service';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-expenses-upsert',
  imports: [CommonModule, ReactiveFormsModule, MatFormField, MatLabel,
    MatInput, MatButton, MatButtonToggleModule, MatIcon, MatSuffix,
    MatTableModule, MatCheckboxModule],
  templateUrl: './expenses-upsert.html',
  styleUrl: './expenses-upsert.css',
})
export class ExpensesUpsert {
  protected readonly SwitchOptions = SwitchOptions;

  private profileService = inject(ProfileService);
  private expensesService = inject(ExpensesService);
  expenseGroupStore = inject(ExpenseGroupStore);
  private snackBar = inject(MatSnackBar);
  isEditMode = signal<boolean>(false);
  currentStep = signal<1 | 2>(1);
  destroyRef = inject(DestroyRef);
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    amount: new FormControl(0.0, {updateOn: 'blur', validators: [Validators.required]}),
    description: new FormControl(''),
    switchOption: new FormControl(this.SwitchOptions.Me)
  });
  formAmount = toSignal(this.form.controls.amount.valueChanges, { initialValue: 0.0 });

  userShares = computed<TableUserShare[]>(() => {
    console.log('computed!')
    const userProfile = this.profileService.myProfile();
    const group = this.expenseGroupStore.selectedGroup();
    const totalAmount = this.formAmount() ?? 0;

    if (!userProfile) {
      return [];
    }

    const shares: TableUserShare[] = [
      {
        index: 0,
        userId: userProfile.id,
        userName: userProfile.username,
        amount: 0,
        percentageShare: 100,
        selected: true
      }
    ];

    const groupMembers = group?.members.filter(member => member.userId !== userProfile.id);

    if (groupMembers) {
      groupMembers.forEach((member, i) => {
        shares.push({
          index: i + 1,
          userId: member.userId,
          userName: member.username,
          amount: 0,
          percentageShare: 0,
          selected: false
        });
      });
    }

    return shares;
  });
  displayedColumns: string[] = ['position', 'userName', 'percentageShare', 'amount'];

  constructor() {
    this.form.get('amount')?.valueChanges
      .subscribe(value => {
        console.log(value);
      });
  }

  goToStep2() {
    const { title, amount } = this.form.controls;
    title.markAsTouched();
    amount.markAsTouched();
    if (title.valid && amount.valid) {
      this.currentStep.set(2);
    }
  }

  goBack() {
    this.currentStep.set(1);
  }

  isAllSelected() {
    return this.userShares().length > 0 && this.userShares().every(row => row.selected);
  }

  isSomeSelected() {
    const selectedCount = this.userShares().filter(row => row.selected).length;
    return selectedCount > 0 && selectedCount < this.userShares().length;
  }

  masterToggle(checked: boolean) {
    this.userShares().forEach(row => row.selected = checked);
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const expense = this.form.value;
    const userShares = this.userShares().map(row => ({
      userId: row.userId,
      shareAmount: row.amount
    }));

    const request: CreateExpenseRequest = {
      title: expense.title!,
      amount: expense.amount!,
      description: expense.description || '',
      userShares: []
    };

    this.expensesService.createExpense(this.expenseGroupStore.selectedGroupId(), request).subscribe({
      next: () => {
        this.formDirective.resetForm();
        this.form.patchValue({
          amount: 0.0,
          switchOption: this.SwitchOptions.Me
        });
        this.currentStep.set(1);

        this.snackBar.open('Expense added!', 'Close', {
          duration: 5000,
        });
      }
    });
  }
}
