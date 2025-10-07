import { ElementRef, Injectable, WritableSignal, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private mobileMenu = new Subject<boolean>();
  private homeMobileMenu = new Subject<boolean>();
  menuVisibility$: Observable<boolean> = this.mobileMenu.asObservable();
  homeMenuVisibility$: Observable<boolean> = this.homeMobileMenu.asObservable();
  sidenavOpenSignal = signal(false);

  constructor() {}

  toggleSidenav() {
    this.sidenavOpenSignal.set(!this.sidenavOpenSignal());
  }
  visible(status: boolean) {
    this.mobileMenu.next(status);
  }
  homeMenuVisible(status: boolean) {
    this.homeMobileMenu.next(!status);
  }
  mobileMenuTest = signal(false);
}
