import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateExpenseGroupRequest,
  ExpenseGroupDetailsDto,
  ExpenseGroupDto,
  InviteToExpenseGroupRequest,
  UpdateExpenseGroupRequest
} from '../models/expense-groups.models';

@Injectable({
  providedIn: 'root',
})
export class ExpenseGroupsService {
  private httpClient = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getExpenseGroups(): Observable<ExpenseGroupDto[]> {
    return this.httpClient.get<ExpenseGroupDto[]>(this.baseUrl + '/api/expense-groups');
  }

  createExpenseGroup(request: CreateExpenseGroupRequest): Observable<ExpenseGroupDto> {
    return this.httpClient.post<ExpenseGroupDto>(this.baseUrl + '/api/expense-groups', request);
  }

  getExpenseGroupById(groupId: string): Observable<ExpenseGroupDetailsDto> {
    return this.httpClient.get<ExpenseGroupDetailsDto>(this.baseUrl + '/api/expense-groups/' + groupId);
  }

  updateExpenseGroup(groupId: string, request: UpdateExpenseGroupRequest): Observable<ExpenseGroupDto> {
    return this.httpClient.patch<ExpenseGroupDto>(this.baseUrl + '/api/expense-groups/' + groupId, request);
  }

  inviteToExpenseGroup(groupId: string, request: InviteToExpenseGroupRequest): Observable<void> {
    return this.httpClient.post<void>(this.baseUrl + '/api/expense-groups/' + groupId + '/invite', request);
  }

  removeMemberFromExpenseGroup(groupId: string, memberUserId: string): Observable<void> {
    return this.httpClient.delete<void>(this.baseUrl + '/api/expense-groups/' + groupId + '/members/' + memberUserId);
  }

  changeExpenseGroupInvitationState(groupId: string, action: 'accept' | 'decline'): Observable<void> {
    return this.httpClient.put<void>(this.baseUrl + '/api/expense-groups/' + groupId + '/' + action, {});
  }
}
