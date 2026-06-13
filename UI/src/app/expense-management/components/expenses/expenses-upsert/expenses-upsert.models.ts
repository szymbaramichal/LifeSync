export enum SwitchOptions {
  Me = 'me',
  Percentage = 'percentage',
  Amount = 'amount'
};

export interface UserShare {
  index: number;
  userName: string;
  userId: string;
  amount: number;
  percentageShare: number;
}
