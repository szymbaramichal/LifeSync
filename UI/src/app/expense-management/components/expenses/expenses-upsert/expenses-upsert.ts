import { Component, inject, input, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from '@angular/material/input';
import { CreateExpenseRequest } from '../../../models/expenses.models';
import { ExpensesService } from '../../../services/expenses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExpenseGroupStore } from '../../../expense-group.store';

@Component({
  selector: 'app-expenses-upsert',
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatButton],
  templateUrl: './expenses-upsert.html',
  styleUrl: './expenses-upsert.css',
})
export class ExpensesUpsert {
  private expensesService = inject(ExpensesService);
  expenseGroupStore = inject(ExpenseGroupStore);
  private snackBar = inject(MatSnackBar);
  isEditMode = signal<boolean>(false);
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    amount: new FormControl(0.0, [Validators.required]),
    description: new FormControl(''),
  });

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const expense = this.form.value;
    const request: CreateExpenseRequest = {
      title: expense.title!,
      amount: expense.amount!,
      description: expense.description!,
    };

    this.expensesService.createExpense(this.expenseGroupStore.selectedGroupId(), request).subscribe({
      next: () => {
        this.formDirective.resetForm();
        this.snackBar.open('Expense added!', 'Close', {
          duration: 5000,
        });
      }
    });
  }
}
