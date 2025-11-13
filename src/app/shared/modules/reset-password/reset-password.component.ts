import { TosterService } from './../../services/toster.service';
import { UserAccountsService } from './../../../api/services/user-accounts.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  changePasswordShow = false;
  resetLoading = false;
  @Input() from!: string;
  resetFormSubmitted = false;
  @Input() mobile!: string;
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';
  constructor(
    private fb: FormBuilder,
    private UserAccountsService: UserAccountsService,
    private ToasterService: TosterService,
   
  ) {
    console.log('hello');
  }
  ngOnInit(): void {
    this.loadForm();
  }
  loadForm() {
    this.resetPasswordForm = this.fb.group(
      {
        newPassword: [
          '',
          
        ],
        confirmPassword: ['', Validators.required],
      },
      
    );
  }
  resetPassword() {}
  confirmPassword() {
    this.resetFormSubmitted = true;

    console.log(this.mobile);

    if (!this.mobile) {
      this.ToasterService.customToast(
        'Mobile no not found. Please contact support team.',
        'error'
      );
    }
    let obj = {
      userId: this.mobile,
      newPassword: this.resetPasswordForm.get('newPassword')?.value,
    };
    if (
      !obj.newPassword &&
      !this.resetPasswordForm.get('confirmPassword')?.value
    ) {
      this.ToasterService.customToast(
        'Please enter your new password',
        'warning'
      );
      return;
    }
    console.log(obj);

    this.resetLoading = true;

  }

  passwordVisibility(field: string) {
    if (field === 'password') {
      this.passwordFieldType =
        this.passwordFieldType === 'password' ? 'text' : 'password';
    } else if (field === 'confirmPassword') {
      this.confirmPasswordFieldType =
        this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    }
  }
}
