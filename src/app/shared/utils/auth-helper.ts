import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

// export function passwordMatchValidator(
//   controlName: string,
//   matchingControlName: string
// ) {
//   return (formGroup: FormGroup) => {
//     const control = formGroup.controls[controlName];
//     const matchingControl = formGroup.controls[matchingControlName];

//     if (matchingControl.errors && !matchingControl.errors['passwordMismatch']) {
//       // return if another validator has already found an error on the matchingControl
//       return;
//     }

//     if (control.value !== matchingControl.value) {
//       matchingControl.setErrors({ passwordMismatch: true });
//       console.log('Password mismatch error set');
//     } else {
//       matchingControl.setErrors(null);
//       console.log('Password mismatch error cleared');
//     }
//   };
// }

export function yearValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;

    if (value && value.length === 10) {
      const year = value.substring(6);
      if (year.length === 4 && !isNaN(Number(year))) {
        return null; // Valid 4-digit year
      }
    }

    return { invalidYear: true };
  };
}

export function customNameValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return null; // If the field is empty, consider it valid
  }

  // Regular expression to validate only letters, numbers, and spaces between words
  const regex = /^[-\w\s]+$/; // /^[a-zA-Z]+(?: [a-zA-Z]+)*[0-9]*$/;

  if (!regex.test(value) || value.length < 3) {
    return { invalidName: true };
  }

  return null;
}

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
};
export class CustomValidators {
  //static startsWithUppercase(
  //  control: AbstractControl
  //): ValidationErrors | null {
  //  const value = control.value as string;
  //  if (value && !/^[A-Z]/.test(value)) {
  //    return { startsWithUppercase: true };
  //  }
  //  return null;
  //}

  // Validate that the password is at least 6 characters long
  static isAtLeast6Characters(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value as string;
    if (value && value.length < 6) {
      return { isAtLeast6Characters: true };
    }
    return null;
  }

  // Validate that the password includes a special character
  static includesSpecialCharacter(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value as string;
    if (value && !/.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\\-=/|]/.test(value)) {
      return { includesSpecialCharacter: true };
    }
    return null;
  }

  // Validate that the password includes a number
  static includesNumber(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (value && !/.*[0-9]/.test(value)) {
      return { includesNumber: true };
    }
    return null;
  }
  static matchValidator(control: AbstractControl): any {
    const password: string = control.get('password')?.value; // get password from our password form control
    const confirmPassword: string = control.get('confirmPassword')?.value; // get password from our confirmPassword form control

    // if the confirmPassword value is null or empty, don't return an error.
    if (!confirmPassword?.length) {
      return null;
    }

    // if the confirmPassword length is < 8, set the minLength error.
    if (confirmPassword.length < 6) {
      control.get('confirmPassword')?.setErrors({ minLength: true });
    } else {
      // compare the passwords and see if they match.
      if (password !== confirmPassword) {
        control.get('confirmPassword')?.setErrors({ mismatch: true });
      } else {
        // if passwords match, don't return an error.
        return null;
      }
    }
  }
  static mobileNumberFormat(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isValid = /^[0-9]+$/.test(control.value);
      return isValid ? null : { invalidFormat: true };
    };
  }

  static mobileNumberLength(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isValidLength = control.value && control.value.length === 11;
      return isValidLength ? null : { invalidLength: true };
    };
  }
}
