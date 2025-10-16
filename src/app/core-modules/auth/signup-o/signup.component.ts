import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorTitle, Gender } from 'src/app/proxy/enums';
import { ListItem } from 'src/app/shared/model/common-model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { countries } from './../../../shared/utils/country';
@Component({
  selector: 'app-signup-component',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [DatePipe],
})
export class SignupComponent  {
  formGroup!: FormGroup;
  titleList: ListItem[] = [];
  genderList: ListItem[] = [];
  durationList: any = [
    { id: 1, name: '1 year' },
    { id: 2, name: '2 year' },
    { id: 3, name: '3 year' },
    { id: 4, name: '4 year' },
    { id: 5, name: '5 year' },
  ];
  countryList = countries;

  constructor(private fb: FormBuilder, private normalAuth: AuthService) {}
}
