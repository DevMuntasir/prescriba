import { Component } from '@angular/core';
import { DoctorDirectoryComponent } from './doctor-directory.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DoctorDirectoryComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
