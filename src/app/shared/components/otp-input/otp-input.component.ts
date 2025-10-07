import { Component, ElementRef, Input, QueryList, ViewChildren, isDevMode } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { getFormArray } from '../../utils/helper';

@Component({
  selector: 'app-otp-input',
  templateUrl: './otp-input.component.html',
  styleUrls: ['./otp-input.component.scss'],
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: OtpInputComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: OtpInputComponent,
      multi: true,
    },
  ]
})
export class OtpInputComponent implements ControlValueAccessor {
  @ViewChildren('inputEl') inputEls!: QueryList<ElementRef<HTMLInputElement>>;
  @Input()
  set size(size: number) {
    this.inputs = getFormArray(size);
    this.#size = size;
  }
  #scheduledFocus: number = 0;
  #size = 4;
  inputs = getFormArray(this.#size);


constructor(){}


  onChange?: (value: string) => void;
  onTouched?: () => void;


  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }


  handleInput() {
    this.#updateWiredValue();
  
    if (this.#scheduledFocus != null) {
      this.#focusInput(this.#scheduledFocus);
      this.#scheduledFocus = 0;
    }
  }
  handleFocus(e: FocusEvent) {
    // Select previously entered value to replace with a new input
    (e.target as HTMLInputElement).select();
  }
  
  handleKeyPress(e: KeyboardEvent, idx: number) {
    const isDigit = /\d/.test(e.key);
  
    // Safari fires Cmd + V through keyPress event as well
    // so we need to handle it here and let it through
    if (e.key === 'v' && e.metaKey) {
      return true;
    }
  
    if (isDigit && idx + 1 < this.#size) {
      // If user inputs digits & we are not on the last input we want
      // to advance the focus
      this.#scheduledFocus = idx + 1;
    }
  
    if (isDigit && this.inputs.controls[idx].value) {
      // If user deselects an input which already has a value
      // we want to clear it so that it doesn't have more than 1 digit
      this.inputs.controls[idx].setValue('');
    }
  
    return isDigit;
  }


  #focusInput(idx: number) {
    // In order not to interfere with the input we setTimeout
    // before advancing the focus
    setTimeout(() => this.inputEls.get(idx)?.nativeElement.focus());
  }
  
  #updateWiredValue() {
    // We want to expose the value as a plain string
    //
    // In order not to interfere with the input we setTimeout
    // before advancing the focus
    setTimeout(() => this.onChange?.(this.inputs.value.join('')));
  }
  handleKeyDown(e: KeyboardEvent, idx: number) {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      if (idx > 0) {
        this.#scheduledFocus = idx - 1;
      }
    }
  }
  handlePaste(e: ClipboardEvent, idx: number) {
    e.preventDefault();
  
    if (idx !== 0) {
      // If the target input is not the first one - ignore
      return;
    }
  
    const pasteData = e.clipboardData?.getData('text');
    // \d stands for digit in RegExp
    // \\d escapes the slash before the "d" which we need
    // because of the regexp being written as a string
    const regex = new RegExp(`\\d{${this.#size}}`);
  
    if (!pasteData || !regex.test(pasteData)) {
      // If there is nothing to be pasted or the pasted data does not
      // comply with the required format - ignore the event
      return;
    }
  
    for (let i = 0; i < pasteData.length; i++) {
      this.inputs.controls[i].setValue(pasteData[i]);
    }
  
    this.#focusInput(this.inputEls.length - 1);
    this.#updateWiredValue();
  
  }

  writeValue(value: string): void {
    if (isDevMode() && value?.length) {
      throw new Error('Otp input is not supposed to be prefilled with data');
    }
  
    // Reset all input values
    this.inputs.setValue(new Array(this.#size).fill(''));
  }
  
  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.inputs.disable();
    } else {
      this.inputs.enable();
    }
  }
  validate(control: AbstractControl<string, string>): ValidationErrors | null {
    if (!control.value || control.value.length < this.#size) {
      return {
        otpInput: 'Value is incorrect',
      };
    }
  
    return null;
  }
}
