import { TosterService } from './../../services/toster.service';
import { UserAccountsService } from './../../../proxy/services/user-accounts.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../utils/auth-helper';
import { MatDialogRef } from '@angular/material/dialog';
import { DynamicDialogComponent } from '../dynamic-dialog/dynamic-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';

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
    public dialogRef: MatDialogRef<DynamicDialogComponent>
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
          [
            Validators.required,
            // CustomValidators.startsWithUppercase,
            CustomValidators.isAtLeast6Characters,
            CustomValidators.includesSpecialCharacter,
            CustomValidators.includesNumber,
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: CustomValidators.matchValidator }
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
    this.UserAccountsService.resetPasswordByInputDto(obj).subscribe({
      next: (res) => {
        if (res.success) {
          this.ToasterService.customToast(String(res.message), 'success');
          // this.resetModalShow = false;
          this.resetLoading = false;
          this.resetFormSubmitted = false;
        } else {
          this.ToasterService.customToast(String(res.message), 'error');
          this.resetFormSubmitted = false;
          this.resetLoading = false;
        }
      },
      error: (err) => {
        this.ToasterService.customToast(String(err.message), 'error');
        this.resetFormSubmitted = false;
        this.resetLoading = false;
      },
    });
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
