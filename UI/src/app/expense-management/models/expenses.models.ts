export interface ExpenseDto {
  id: string;
  amount: number;
  title: string;
  description: string;
  userShares: UserShareResultDto[];
}

export interface UserShareResultDto {
  userId: string;
  username: string;
  shareAmount: number;
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
