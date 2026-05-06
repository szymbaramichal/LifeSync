export interface ExpenseGroupDto {
  id: string;
  name: string;
  isPrivate: boolean;
  groupRole: string;
}

export interface ExpenseDto {
  id: string;
  amount: number;
  title: string;
  description: string;
}

export enum GroupRole {
  Owner = 0,
  Member = 1
}

export interface CreateExpenseRequest {
  amount: number;
  title: string;
  description: string;
}

export interface UpdateExpenseRequest {
  amount: number;
  title: string;
  description: string;
}
