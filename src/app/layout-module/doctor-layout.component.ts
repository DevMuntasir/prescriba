import { Component } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

@Component({
  selector: 'app-doctor-layout',
  templateUrl: './doctor-layout.component.html',
  styleUrls: ['./doctor-layout.component.scss'],
  standalone: true,
  imports: [RouterModule],
})
export class DoctorLayoutComponent {}
