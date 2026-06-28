export interface MeResponse {
  id: string;
  firebaseUid: string;
  username: string;
  description: string;
}

export interface MeDto {
  id: string;
  username: string;
  description: string;
}

export interface CreateProfileRequest {
  username: string;
}

export interface CreateProfileResponse {
  id: string;
  firebaseUid: string;
  username: string;
  description: string;
}

export interface UpdateProfileRequest {
  description: string;
}

export interface UpdateProfileResponse {
  id: string;
  description: string;
}
