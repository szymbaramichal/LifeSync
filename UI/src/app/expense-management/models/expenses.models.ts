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

export interface UpdateExpenseRequest {
  amount: number;
  title: string;
  description: string;
}
