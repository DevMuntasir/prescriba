import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminPrescriptionService } from '../services/admin.prescription.service';
import { AuthService } from 'src/app/shared/services/auth.service';

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
  private readonly adminPrescriptionService = inject(AdminPrescriptionService);
  private readonly authService = inject(AuthService);

  readonly regionalPerformance: any[] = [
    {
      name: 'Dhaka division',
      shareLabel: '34% of volume',
      sharePercent: 34,
      prescriptions: 6820,
      totalMedicines: 198,
      topMedicine: {
        name: 'Metformin 500mg',
        prescriptions: 1240,
        share: '18% of scripts',
      },
      notableInsights:
        'Digital-first clinics drove a 9% lift in chronic care renewals.',
      genderSplit: [
        { label: 'Female', percent: 56, barClass: 'from-rose-400 to-rose-500' },
        {
          label: 'Male',
          percent: 40,
          barClass: 'from-brand-primary to-emerald-400',
        },
        {
          label: 'Other / Undisclosed',
          percent: 4,
          barClass: 'from-indigo-400 to-sky-400',
        },
      ],
    },
    {
      name: 'Chattogram',
      shareLabel: '21% of volume',
      sharePercent: 21,
      prescriptions: 4185,
      totalMedicines: 142,
      topMedicine: {
        name: 'Amlodipine 5mg',
        prescriptions: 820,
        share: '20% of scripts',
      },
      notableInsights:
        'Seaport employer partnerships added 260 new patients this cycle.',
      genderSplit: [
        { label: 'Female', percent: 48, barClass: 'from-rose-400 to-rose-500' },
        {
          label: 'Male',
          percent: 47,
          barClass: 'from-brand-primary to-emerald-400',
        },
        {
          label: 'Other / Undisclosed',
          percent: 5,
          barClass: 'from-indigo-400 to-sky-400',
        },
      ],
    },
    {
      name: 'Rajshahi',
      shareLabel: '14% of volume',
      sharePercent: 14,
      prescriptions: 2790,
      totalMedicines: 116,
      topMedicine: {
        name: 'Montelukast 10mg',
        prescriptions: 442,
        share: '16% of scripts',
      },
      notableInsights:
        'Seasonal allergy cases peaked, nudging average prescription lengths higher.',
      genderSplit: [
        { label: 'Female', percent: 44, barClass: 'from-rose-400 to-rose-500' },
        {
          label: 'Male',
          percent: 49,
          barClass: 'from-brand-primary to-emerald-400',
        },
        {
          label: 'Other / Undisclosed',
          percent: 7,
          barClass: 'from-indigo-400 to-sky-400',
        },
      ],
    },
    {
      name: 'Sylhet',
      shareLabel: '11% of volume',
      sharePercent: 11,
      prescriptions: 2146,
      totalMedicines: 104,
      topMedicine: {
        name: 'Salbutamol inhaler',
        prescriptions: 386,
        share: '18% of scripts',
      },
      notableInsights:
        'Cross-border clinics are fuelling respiratory consult growth.',
      genderSplit: [
        { label: 'Female', percent: 46, barClass: 'from-rose-400 to-rose-500' },
        {
          label: 'Male',
          percent: 45,
          barClass: 'from-brand-primary to-emerald-400',
        },
        {
          label: 'Other / Undisclosed',
          percent: 9,
          barClass: 'from-indigo-400 to-sky-400',
        },
      ],
    },
  ];

  selectedRegion: any = this.regionalPerformance[0];
  selectRegion(region: any): void {
    this.selectedRegion = region;
  }

  trackRegionByName(_: number, region: any): string {
    return region.name;
  }
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
    // {
    //   label: 'Analytics report',
    //   icon: 'analytics',
    //   description: 'Deep dive into insights',
    //   badge: 'Coming soon',
    // },
  ];

  onLogout(): void {}
}
