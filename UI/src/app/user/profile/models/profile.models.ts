export interface MeResult {
  id: number;
  firebaseUid: string;
  displayName: string;
}

export interface MeDto {
  id: number;
  displayName: string;
}

export interface CreateProfileRequest {
  displayName: string;
}

export interface CreateProfileResult {
  id: number;
  firebaseUid: string;
  displayName: string;
}
