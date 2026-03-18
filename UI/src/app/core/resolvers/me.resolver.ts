import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProfileService } from '../../user/profile/profile.service';
import { MeDto } from '../../user/profile/profile.models';

export const meResolver: ResolveFn<MeDto> = (route, state) => {
  const profileService = inject(ProfileService);
  
  return profileService.me();
};