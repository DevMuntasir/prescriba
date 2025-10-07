import { FormArray, FormControl } from "@angular/forms";

export function getFormArray(size: number): FormArray {
    const arr = [];
  
    for (let i = 0; i < size; i++) {
      arr.push(new FormControl(''));
    }
  
    return new FormArray(arr);
  }

