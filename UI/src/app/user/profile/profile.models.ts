export interface MeResponse {
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

export interface CreateProfileResponse {
  id: number;
  firebaseUid: string;
  displayName: string;
}
