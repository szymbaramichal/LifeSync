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

export interface CreateExpenseRequest {
  amount: number;
  title: string;
  description: string;
}
