import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppAuthService } from '../../../auth-services/app-auth.service';

interface SidebarLink {
  readonly label: string;
  readonly icon:
    | 'dashboard'
    | 'prescriptions'
    | 'doctors'
    | 'patients'
    | 'settings'
    | 'analytics';
  readonly description: string;
  readonly path?: string;
  readonly badge?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent {
  readonly sidebarLinks: SidebarLink[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      description: 'Command centre overview',
      path: '/ps-admin/dashboard',
    },
    {
      label: 'Prescriptions',
      icon: 'prescriptions',
      description: 'Monitor generated scripts',
      badge: 'Live',
      path: '/ps-admin/dashboard/prescriptions',
    },
    {
      label: 'Doctors',
      icon: 'doctors',
      description: 'Manage prescriber network',
      path: '/ps-admin/dashboard/doctors',
    },
    {
      label: 'Patients',
      icon: 'patients',
      description: 'Verify patient journeys',
    },
    {
      label: 'Settings',
      icon: 'settings',
      description: 'Security & configuration',
    },
    {
      label: 'Analytics report',
      icon: 'analytics',
      description: 'Deep dive into insights',
      badge: 'Coming soon',
    },
  ];

  constructor(private readonly authService: AppAuthService) {}

  onLogout(): void {
    this.authService.logout();
  }
}
