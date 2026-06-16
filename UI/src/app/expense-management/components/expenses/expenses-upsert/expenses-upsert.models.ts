export enum SwitchOptions {
  Me = 'me',
  Percentage = 'percentage',
  Amount = 'amount'
};

export interface TableUserShare {
  index: number;
  userName: string;
  userId: string;
  amount: number;
  percentageShare: number;
  selected: boolean;
}
