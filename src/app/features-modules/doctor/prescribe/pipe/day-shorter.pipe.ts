import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayShorter',
  standalone: true,
})
export class DayShorterPipe implements PipeTransform {
  transform(value: string, isLast: boolean = false): string {
    if (!value) return '';
    return isLast ? value.slice(0, 3) : value.slice(0, 3) + ',';
  }
}
