import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateExpenseRequest, ExpenseDto, ExpenseGroupDto, UpdateExpenseRequest } from './expenses.models';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  private httpClient = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getExpenseGroups(): Observable<ExpenseGroupDto[]> {
    return this.httpClient.get<ExpenseGroupDto[]>(this.baseUrl + '/api/expense-groups');
  }

  getExpenses(groupId: string): Observable<ExpenseDto[]> {
    return this.httpClient.get<ExpenseDto[]>(
      this.baseUrl + '/api/expense-groups/' + groupId + '/expenses'
    );
  }

  createExpense(groupId: string, request: CreateExpenseRequest): Observable<ExpenseDto> {
    return this.httpClient.post<ExpenseDto>(
      this.baseUrl + '/api/expense-groups/' + groupId + '/expenses',
      request
    );
  }

  updateExpense(groupId: string, expenseId: string, request: UpdateExpenseRequest): Observable<ExpenseDto> {
    return this.httpClient.put<ExpenseDto>(
      this.baseUrl + '/api/expense-groups/' + groupId + '/expenses/' + expenseId,
      request
    );
  }

  deleteExpense(groupId: string, expenseId: string): Observable<void> {
    return this.httpClient.delete<void>(
      this.baseUrl + '/api/expense-groups/' + groupId + '/expenses/' + expenseId
    );
  }
}
