import { Component, DestroyRef, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwitchOptions, UserShare } from './expenses-upsert.models';
import { ProfileService } from '../../../../user/profile/profile.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expenses-upsert',
  imports: [CommonModule, ReactiveFormsModule, MatFormField, MatLabel,
    MatInput, MatButton, MatButtonToggleModule, MatIcon, MatSuffix,
    MatTableModule],
  templateUrl: './expenses-upsert.html',
  styleUrl: './expenses-upsert.css',
})
export class ExpensesUpsert implements OnInit {
  protected readonly SwitchOptions = SwitchOptions;

  private profileService = inject(ProfileService);
  private expensesService = inject(ExpensesService);
  expenseGroupStore = inject(ExpenseGroupStore);
  private snackBar = inject(MatSnackBar);
  isEditMode = signal<boolean>(false);
  destroyRef = inject(DestroyRef);
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  userShares = signal<UserShare[]>([]);
  displayedColumns: string[] = ['position', 'userName', 'percentageShare', 'amount'];

  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    amount: new FormControl(0.0, [Validators.required]),
    description: new FormControl(''),
    switchOption: new FormControl(this.SwitchOptions.Me)
  });

  ngOnInit(): void {
    this.form.get('switchOption')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(option => {
      });

    const userProfile = this.profileService.myProfile();
    if (!userProfile)
      return;

    this.userShares().push({
      index: 0,
      userId: this.profileService.myProfile()!.id,
      userName: this.profileService.myProfile()!.username,
      amount: 0,
      percentageShare: 100
    });
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
      description: expense.description || ''
    };

    this.expensesService.createExpense(this.expenseGroupStore.selectedGroupId(), request).subscribe({
      next: () => {
        this.formDirective.resetForm();
        this.form.patchValue({
          amount: 0.0,
          switchOption: this.SwitchOptions.Me
        });

        this.snackBar.open('Expense added!', 'Close', {
          duration: 5000,
        });
      }
    });
  }
}
