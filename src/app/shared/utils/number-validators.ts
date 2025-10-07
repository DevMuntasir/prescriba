import { Directive, forwardRef, Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
import { catchError, debounceTime, map, Observable, of, switchMap } from 'rxjs';
import { UserManageAccountsService } from '../../core-modules/auth/auth-service/user-manage-accounts.service';

@Injectable({
  providedIn: 'root',
})
export class NumberValidators implements AsyncValidator {
  constructor(private userService: UserManageAccountsService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(600),
      switchMap((phoneNumber) =>
        this.userService.checkUserExistByUserNameByMobileNo(phoneNumber).pipe(
          map((response) => {
            return response.is_success ? null : { phoneTaken: true };
          }),
          catchError(() => of(null))
        )
      )
    );
  }
}

@Directive({
  selector: '[PhoneNumberValidator]',
  standalone: true,
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => PhoneNumberValidatorDirective),
      multi: true,
    },
  ],
})
export class PhoneNumberValidatorDirective implements AsyncValidator {
  constructor(private validator: NumberValidators) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.validator.validate(control);
  }
}
