import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface SummaryStat {
  readonly label: string;
  readonly value: string;
  readonly hint: string;
  readonly badge: string;
  readonly badgeClass: string;
  readonly icon: 'approvals' | 'clinicians' | 'tickets' | 'compliance';
  readonly iconBgClass: string;
}

interface QuickLink {
  readonly label: string;
  readonly description: string;
  readonly cta: string;
  readonly icon: 'users' | 'approvals' | 'insights' | 'broadcast';
  readonly iconBgClass: string;
}

interface RecentUpdate {
  readonly message: string;
  readonly highlight?: string;
  readonly time: string;
  readonly indicatorClass: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent {
  readonly summaryStats: SummaryStat[] = [
    {
      label: 'Pending approvals',
      value: '12',
      hint: 'Awaiting review before activation',
      badge: '+4 new',
      badgeClass: 'bg-brand-primary/10 text-brand-primary',
      icon: 'approvals',
      iconBgClass:
        'bg-[linear-gradient(135deg,var(--brand-primary)_0%,var(--brand-primary-accent)_100%)] shadow-[0_12px_24px_rgba(6,180,139,0.25)]',
    },
    {
      label: 'Active clinicians',
      value: '248',
      hint: 'Logged in within the last month',
      badge: '↑ 8% MoM',
      badgeClass: 'bg-emerald-100 text-emerald-600',
      icon: 'clinicians',
      iconBgClass: 'bg-[linear-gradient(135deg,#14b8a6_0%,#5eead4_100%)] shadow-[0_12px_24px_rgba(20,184,166,0.25)]',
    },
    {
      label: 'Support tickets',
      value: '5',
      hint: '2 escalated for follow-up',
      badge: '2 urgent',
      badgeClass: 'bg-orange-100 text-orange-600',
      icon: 'tickets',
      iconBgClass: 'bg-[linear-gradient(135deg,#38bdf8_0%,#60a5fa_100%)] shadow-[0_12px_24px_rgba(59,130,246,0.25)]',
    },
    {
      label: 'Compliance score',
      value: '96%',
      hint: 'Audit ready across all divisions',
      badge: '+2 this week',
      badgeClass: 'bg-violet-100 text-violet-600',
      icon: 'compliance',
      iconBgClass: 'bg-[linear-gradient(135deg,#a855f7_0%,#c084fc_100%)] shadow-[0_12px_24px_rgba(168,85,247,0.25)]',
    },
  ];

  readonly quickLinks: QuickLink[] = [
    {
      label: 'Manage user roles',
      description: 'Invite administrators, reset credentials and update permissions.',
      cta: 'Open directory',
      icon: 'users',
      iconBgClass:
        'bg-[linear-gradient(135deg,var(--brand-primary)_0%,var(--brand-primary-accent)_100%)] shadow-[0_12px_24px_rgba(6,180,139,0.25)]',
    },
    {
      label: 'Approve clinicians',
      description: 'Review documentation and activate new prescribers in minutes.',
      cta: 'Review queue',
      icon: 'approvals',
      iconBgClass: 'bg-[linear-gradient(135deg,#3b82f6_0%,#60a5fa_100%)] shadow-[0_12px_24px_rgba(59,130,246,0.25)]',
    },
    {
      label: 'Usage analytics',
      description: 'Track adoption, peak usage hours and trending specialties.',
      cta: 'View reports',
      icon: 'insights',
      iconBgClass: 'bg-[linear-gradient(135deg,#f97316_0%,#fbbf24_100%)] shadow-[0_12px_24px_rgba(249,115,22,0.25)]',
    },
    {
      label: 'Broadcast updates',
      description: 'Send policy updates or planned maintenance announcements.',
      cta: 'Compose notice',
      icon: 'broadcast',
      iconBgClass: 'bg-[linear-gradient(135deg,#8b5cf6_0%,#c4b5fd_100%)] shadow-[0_12px_24px_rgba(139,92,246,0.25)]',
    },
  ];

  readonly recentUpdates: RecentUpdate[] = [
    {
      message: 'Policy update shared with ',
      highlight: 'Cardiology department',
      time: '12 minutes ago',
      indicatorClass: 'bg-emerald-400',
    },
    {
      message: 'New clinician application received from ',
      highlight: 'Dr. Reza Karim',
      time: '32 minutes ago',
      indicatorClass: 'bg-blue-400',
    },
    {
      message: 'Quarterly compliance export completed for ',
      highlight: 'Dhaka division',
      time: '1 hour ago',
      indicatorClass: 'bg-orange-400',
    },
  ];
}
