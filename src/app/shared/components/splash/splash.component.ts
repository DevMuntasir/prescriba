import { SplashScreenService } from './../../utils/interceptors/splash-screen.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
export class SplashComponent {
  constructor(public loader: SplashScreenService) {}
}
