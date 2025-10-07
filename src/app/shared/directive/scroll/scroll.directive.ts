import { Directive,  HostListener } from '@angular/core';

@Directive({
  selector: '[appScroll]',
  standalone: true
})
export class ScrollDirective {
  @HostListener('click') onClick() {
    window.scrollTo({ top: 0, behavior: 'smooth' });  }

}
