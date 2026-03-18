import { afterNextRender, Component, inject, input, signal } from '@angular/core';
import { MeDto } from '../profile.models';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './me.html',
  styleUrl: './me.css',
})
export class Me {
  me = input.required<MeDto>();
  displayName = '';

  constructor() {
    afterNextRender(() => {
      this.displayName = this.me().displayName;
    });
  }
}
