export interface MeResponse {
  id: number;
  firebaseUid: string;
  username: string;
}

export interface MeDto {
  id: number;
  username: string;
}

export interface CreateProfileRequest {
  username: string;
}

export interface CreateProfileResponse {
  id: number;
  firebaseUid: string;
  username: string;
}
