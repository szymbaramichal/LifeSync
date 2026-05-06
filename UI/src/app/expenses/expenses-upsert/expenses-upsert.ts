import { Component, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from '@angular/material/input';
import { CreateExpenseRequest } from '../expenses.models';
import { ExpensesService } from '../expenses.service';

@Component({
  selector: 'app-expenses-upsert',
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatButton],
  templateUrl: './expenses-upsert.html',
  styleUrl: './expenses-upsert.css',
})
export class ExpensesUpsert {
  private expensesService = inject(ExpensesService);
  expenseGroupId = input<string>('');
  isEditMode = signal<boolean>(false);

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
    this.expensesService.createExpense(this.expenseGroupId(), request).subscribe();
  }
}
