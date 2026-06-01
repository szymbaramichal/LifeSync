export interface ExpenseGroupDto {
  id: string;
  name: string;
  isPrivate: boolean;
  groupRole: GroupRole;
  isPendingInvitation: boolean;
}

export enum GroupRole {
  Owner = 0,
  Member = 1
}

export interface CreateExpenseGroupRequest {
  name: string;
}

export interface ExpenseGroupMemberDto {
  userId: string;
  username: string;
  groupRole: GroupRole;
  isPendingInvitation: boolean;
}

export interface ExpenseGroupDetailsDto {
  id: string;
  name: string;
  isPrivate: boolean;
  groupRole: GroupRole;
  members: ExpenseGroupMemberDto[];
}

export interface UpdateExpenseGroupRequest {
  name: string;
  isPrivate: boolean;
}

export interface InviteToExpenseGroupRequest {
  username: string;
}
