import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseGroupsService } from '../../../services/expense-groups.service';
import { CreateExpenseGroupRequest } from '../../../models/expense-groups.models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { ExpenseGroupStore } from '../../../expense-group.store';

@Component({
  selector: 'app-create-group',
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatButton],
  templateUrl: './create-group.html',
  styleUrl: './create-group.css',
})
export class CreateGroup {
  private formBuilder = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  private expenseGroupService = inject(ExpenseGroupsService);
  private expenseGroupStore = inject(ExpenseGroupStore);

  form: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]]
  });

  onSubmit() {
    if (!this.form.valid)
      return;

    const request: CreateExpenseGroupRequest = {
      name: this.form.value.name
    }

    this.expenseGroupService.createExpenseGroup(request).subscribe({
      next: () => {
        this.formDirective.resetForm();
        this.expenseGroupStore.refresh();
        this.snackBar.open('Group added!', 'Close', {
          duration: 5000,
        });
      }
    });
  }
}
