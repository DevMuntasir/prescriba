import { AuthService } from 'src/app/shared/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],

})
export class AppointmentsComponent implements OnInit {

  doctorId: any;
  constructor(
    private NormalAuth: AuthService,
  ) {}
  ngOnInit(): void {
    let authId = this.NormalAuth.authInfo().id;
    this.doctorId = authId;
  }
}
