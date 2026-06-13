export interface ExpenseDto {
  id: string;
  amount: number;
  title: string;
  description: string;
}

export interface UserShareDto {
  userId: string;
  shareAmount: number;
}

export interface CreateExpenseRequest {
  amount: number;
  title: string;
  description: string;
  userShares: UserShareDto[];
}

export interface UpdateExpenseRequest {
  amount: number;
  title: string;
  description: string;
}
