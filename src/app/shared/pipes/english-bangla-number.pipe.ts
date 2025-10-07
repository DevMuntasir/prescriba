import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'banglaNumerals',
})
export class BanglaNumeralsPipe implements PipeTransform {
  transform(value: number | string): string {
    const banglaDigits: { [key: number]: string } = {
      0: '০',
      1: '১',
      2: '২',
      3: '৩',
      4: '৪',
      5: '৫',
      6: '৬',
      7: '৭',
      8: '৮',
      9: '৯',
    };

    let result = String(value)
      .split('')
      .map((digit: string) => {
        const num = parseInt(digit, 10);
        return isNaN(num) ? digit : banglaDigits[num];
      })
      .join('');

    return '00';
  }
}
