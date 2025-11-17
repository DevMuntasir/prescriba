import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MenuService } from 'src/app/shared/services/menu.service';
import { UserinfoStateService } from 'src/app/shared/services/states/userinfo-state.service';
@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss'],
})
export class DoctorComponent {
  private sanitizer = inject(DomSanitizer);
  menuList = [
    {
      menuName: 'Dashboard',
      route: 'dashboard',
      icon: this.sanitizer.bypassSecurityTrustHtml(`
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>`),
    },
    {
  menuName: 'E-Chamber',
  route: 'e-chamber',
  icon: this.sanitizer.bypassSecurityTrustHtml(`
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 21v-4a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6v4" />
      <circle cx="12" cy="7" r="4" />
      <path d="M10 11h4" />
    </svg>`),
},

    {
      menuName: 'Patients',
      route: 'patients',
      icon: this.sanitizer.bypassSecurityTrustHtml(`
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>`),
    },
    {
      menuName: 'Prescriptions',
      route: 'prescriptions',
      icon: this.sanitizer.bypassSecurityTrustHtml(`
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <path d="M9 8h4a2 2 0 0 1 0 4h-2" />
          <path d="M9 8v8" />
          <path d="M14 15l3 3" />
          <path d="M17 15l-3 3" />
        </svg>`),
    },
    {
      menuName: 'Appointment',
      route: 'appointments',
      icon: this.sanitizer.bypassSecurityTrustHtml(`
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>`),
    },
    {
      menuName: 'Hospital',
      route: 'hospital',
      icon: this.sanitizer.bypassSecurityTrustHtml(`
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>`),
    },
    // {
    //   menuName: 'Schedule',
    //   route: 'schedule',
    //   icon: this.sanitizer.bypassSecurityTrustHtml(`
    //     <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
    //       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    //       <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    //       <line x1="16" y1="2" x2="16" y2="6"></line>
    //       <line x1="8" y1="2" x2="8" y2="6"></line>
    //       <line x1="3" y1="10" x2="21" y2="10"></line>
    //       <polyline points="16 14 12 18 9 15"></polyline>
    //     </svg>`),
    // },
    {
      menuName: 'Settings',
      route: 'profile-settings',
      icon: this.sanitizer.bypassSecurityTrustHtml(`
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83
                   2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33
                   1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09
                   A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0
                   2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82
                   1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09
                   A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83
                   2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9
                   a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09
                   a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06
                   a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06
                   a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21
                   a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09
                   a1.65 1.65 0 0 0-1.51 1z">
          </path>
        </svg>`),
    },
  ];

  visiblemenu!: boolean;
  sidenavOpenSignal: any;
  eventState = false;

  constructor(
    private NormalAuth: AuthService,
    private UserinfoStateService: UserinfoStateService,
    private menuService: MenuService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    let user = this.NormalAuth.authInfo();
    if (user.id) {
      this.UserinfoStateService.getProfileInfo(user.id, user.userType);
    }
    this.menuService.menuVisibility$.subscribe((res) => {
      this.visiblemenu = res;
    });
  }

  sideBarOpenChange(state: any) {
    if (!state) {
      this.menuService.visible(false);
    }
  }
}
