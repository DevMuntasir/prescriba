import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent {
  readonly quickLinks = [
    { label: 'User Management', description: 'Invite administrators, manage roles and reset credentials.', icon: 'supervised_user_circle' },
    { label: 'Clinician Approvals', description: 'Review pending prescribers and approve or reject in one place.', icon: 'assignment_turned_in' },
    { label: 'Usage Insights', description: 'Monitor activity metrics to keep your organisation compliant.', icon: 'analytics' },
  ];
}
