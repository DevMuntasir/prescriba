import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import {
  AdminPrescriptionService,
  CompanyPerformanceSummary,
  MedicationDivisionUsage,
  MedicationUsage,
  PatientAgeDistribution,
} from '../../services/admin.prescription.service';
import { finalize } from 'rxjs';
import { RouterModule } from '@angular/router';

type TrendDirection = 'up' | 'down' | 'steady';

interface SummaryStat {
  readonly label: string;
  readonly value: string;
  readonly hint: string;
  readonly badge: string;
  readonly badgeClass: string;
  readonly icon: 'approvals' | 'clinicians' | 'tickets' | 'compliance';
  readonly iconBgClass: string;
}

interface DemographicMetric {
  readonly label: string;
  readonly total: string;
  readonly share: string;
  readonly change: string;
  readonly icon: 'female' | 'male' | 'family';
  readonly accentClass: string;
}

interface AgeDistribution {
  readonly range: string;
  readonly patients: number;
  readonly percent: number;
  readonly accentClass: string;
}

interface CompanyPerformanceCard {
  readonly companyName: string;
  readonly prescriptionCount: number;
  readonly marketShare: number;
  readonly topDistricts: string;
  readonly trendDirection: TrendDirection;
  readonly trendLabel: string;
  readonly accentClass: string;
}

interface RegionGenderSplit {
  readonly label: string;
  readonly percent: number;
  readonly barClass: string;
}

interface RegionalPerformance {
  readonly name: string;
  readonly shareLabel: string;
  readonly sharePercent: number;
  readonly prescriptions: number;
  readonly totalMedicines: number;
  readonly topMedicine: {
    readonly name: string;
    readonly prescriptions: number;
    readonly share: string;
  };
  readonly notableInsights: string;
  readonly genderSplit: readonly RegionGenderSplit[];
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

type PeriodKey = 'day' | 'week' | 'month';

interface MedicinePerformance {
  readonly medicationId: number;
  readonly name: string;
  readonly category: string;
  readonly prescriptions: number;
  readonly share: string;
  readonly growth: string;
  readonly trend: TrendDirection;
}

interface DoctorSummary {
  readonly id: number;
  readonly name: string;
  readonly speciality: string;
  readonly region: string;
  readonly avatarInitials: string;
  readonly avatarBgClass: string;
  readonly totalPrescriptions: number;
  readonly newPatients: number;
  readonly repeatRate: string;
}
interface DemographicMetric {
  readonly label: string;
  readonly total: string;
  readonly share: string;
  readonly change: string;
  readonly icon: 'female' | 'male' | 'family';
  readonly accentClass: string;
  readonly changeClass?: string;
}
interface DoctorDetail {
  readonly utilisation: string;
  readonly utilisationChange: string;
  readonly utilisationTrend: TrendDirection;
  readonly digitalShare: string;
  readonly followUpRate: string;
  readonly followUpChange: string;
  readonly followUpTrend: TrendDirection;
  readonly topMedicines: {
    readonly name: string;
    readonly prescriptions: number;
    readonly share: string;
  }[];
  readonly upcomingClinics: {
    readonly date: string;
    readonly window: string;
    readonly location: string;
  }[];
  readonly patientFeedback: {
    readonly score: string;
    readonly change: string;
    readonly positive: boolean;
  };
}

@Component({
  selector: 'app-admin-dashboard-overview',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class AdminDashboardOverviewComponent {
  private readonly adminPrescriptionService = inject(AdminPrescriptionService);

  readonly periodLabels: Record<PeriodKey, string> = {
    day: 'Today',
    week: 'This week',
    month: 'This month',
  };

  readonly periodKeys: PeriodKey[] = ['day', 'week', 'month'];

  topMedicationsLoading = false;
  topMedicationsError: string | null = null;
  prescriptionAnalyticsLoading = false;
  prescriptionAnalyticsError: string | null = null;

  selectedMedicinePeriod: PeriodKey = 'day';
  medicinePerformance: Record<PeriodKey, MedicinePerformance[]> = {
    day: [],
    week: [],
    month: [],
  };

  medicineModalOpen = false;
  selectedMedicine: MedicinePerformance | null = null;
  divisionLoading = false;
  divisionError: string | null = null;
  divisionMetrics: MedicationDivisionUsage[] = [];
  ageDistributionLoading = false;
  ageDistributionError: string | null = null;
  ageDistribution: AgeDistribution[] = [];
  ageDistributionTotalPatients = 0;
  companyPerformanceLoading = false;
  companyPerformanceError: string | null = null;
  companyPerformanceCards: CompanyPerformanceCard[] = [];

  private readonly ageDistributionAccents = [
    'from-sky-400 to-brand-primary-accent',
    'from-brand-primary to-emerald-400',
    'from-violet-500 to-fuchsia-400',
    'from-amber-500 to-orange-400',
    'from-rose-500 to-rose-400',
  ];
  private readonly companyAccentClasses = [
    'from-brand-primary to-emerald-400',
    'from-sky-400 to-brand-primary-accent',
    'from-violet-500 to-fuchsia-400',
    'from-amber-500 to-orange-400',
    'from-rose-500 to-pink-400',
    'from-indigo-500 to-sky-400',
  ];

  private readonly divisionCache = new Map<number, MedicationDivisionUsage[]>();

  ngOnInit(): void {
    this.loadTopMedications();
    this.loadAgeDistribution();
    this.loadCompanyPerformanceOverview();
    // this.loadPrescriptionAnalytics();
  }
  private loadTopMedications(): void {
    this.topMedicationsLoading = true;
    this.topMedicationsError = null;

    this.adminPrescriptionService
      .getMostUsedMedications()
      .pipe(finalize(() => (this.topMedicationsLoading = false)))
      .subscribe({
        next: (response) => {
          const items = response?.result ?? response?.results ?? [];

          if (!items.length) {
            this.medicinePerformance = { day: [], week: [], month: [] };
            this.topMedicationsError = response?.message ?? 'No medication usage data available right now.';
            return;
          }

          const totalUsage =
            response?.totalCount && response.totalCount > 0
              ? response.totalCount
              : items.reduce((sum, item) => sum + item.usageCount, 0);

          const mapped = items.map((item) => this.mapMedicationUsageToPerformance(item, totalUsage));

          this.medicinePerformance = {
            day: mapped,
            week: [...mapped],
            month: [...mapped],
          };
        },
        error: () => {
          this.topMedicationsError = 'Unable to load top prescribed medicines.';
          this.medicinePerformance = { day: [], week: [], month: [] };
        },
      });
  }

  private loadAgeDistribution(): void {
    this.ageDistributionLoading = true;
    this.ageDistributionError = null;

    this.adminPrescriptionService
      .getPatientAgeDistribution()
      .pipe(finalize(() => (this.ageDistributionLoading = false)))
      .subscribe({
        next: (response) => {
          const groups =
            (response?.results ?? response?.result ?? []) as PatientAgeDistribution[];

          if (!groups.length) {
            this.ageDistribution = [];
            this.ageDistributionTotalPatients = 0;
            this.ageDistributionError =
              response?.message ?? 'No age distribution data available right now.';
            return;
          }

          const mapped = groups.map((group, index) => {
            const patients =
              typeof group.patientCount === 'number' && Number.isFinite(group.patientCount)
                ? group.patientCount
                : 0;
            const percentValue =
              typeof group.percentage === 'number' && Number.isFinite(group.percentage)
                ? group.percentage
                : Number(group.percentage ?? 0);
            const percent = Number.isFinite(percentValue)
              ? Number(percentValue.toFixed(2))
              : 0;

            return {
              range: group.ageGroup?.trim() || 'Unknown',
              patients,
              percent,
              accentClass:
                this.ageDistributionAccents[index % this.ageDistributionAccents.length],
            };
          });

          this.ageDistribution = mapped;
          this.ageDistributionError = null;
          this.ageDistributionTotalPatients = mapped.reduce(
            (sum, item) => sum + item.patients,
            0
          );
        },
        error: () => {
          this.ageDistributionError = 'Unable to load age distribution data.';
          this.ageDistribution = [];
          this.ageDistributionTotalPatients = 0;
        },
      });
  }

  private loadCompanyPerformanceOverview(): void {
    this.companyPerformanceLoading = true;
    this.companyPerformanceError = null;

    this.adminPrescriptionService
      .getCompanyPerformanceOverview(5)
      .pipe(finalize(() => (this.companyPerformanceLoading = false)))
      .subscribe({
        next: (response) => {
          const companies =
            (response?.results ?? response?.result ?? []) as CompanyPerformanceSummary[];

          if (!companies.length) {
            this.companyPerformanceCards = [];
            this.companyPerformanceError =
              response?.message ?? 'No company performance data available right now.';
            return;
          }

          this.companyPerformanceCards = companies.map((company, index) =>
            this.mapCompanyPerformanceToCard(company, index)
          );
          this.companyPerformanceError = null;
        },
        error: () => {
          this.companyPerformanceError = 'Unable to load company performance data.';
          this.companyPerformanceCards = [];
        },
      });
  }

  private mapMedicationUsageToPerformance(usage: MedicationUsage, total: number): MedicinePerformance {
    const genericName = (usage.genericName || '').trim();
    const manufacturer = (usage.manufacturer || '').trim();
    const descriptorParts = [genericName, manufacturer].filter((part) => part);
    const category = descriptorParts.length ? descriptorParts.join(' | ') : 'Not specified';
    const shareValue = total > 0 ? (usage.usageCount / total) * 100 : 0;
    const normalizedShare = Number.isFinite(shareValue) ? shareValue : 0;
    const formattedShare =
      normalizedShare === 0 ? '0' : normalizedShare.toFixed(1).replace(/\.0$/, '');

    return {
      medicationId: usage.medicationId,
      name: usage.medicationName,
      category,
      prescriptions: usage.usageCount,
      share: `${formattedShare}%`,
      growth: '--',
      trend: 'steady',
    };
  }

  private mapCompanyPerformanceToCard(
    company: CompanyPerformanceSummary,
    index: number
  ): CompanyPerformanceCard {
    const prescriptionCount =
      typeof company.prescriptionCount === 'number' && Number.isFinite(company.prescriptionCount)
        ? company.prescriptionCount
        : 0;

    const marketShareValue =
      typeof company.marketSharePercent === 'number' && Number.isFinite(company.marketSharePercent)
        ? company.marketSharePercent
        : Number(company.marketSharePercent ?? 0);
    const marketShare = Number.isFinite(marketShareValue)
      ? Number(marketShareValue.toFixed(2))
      : 0;

    const direction: TrendDirection =
      company.trendDirection === 'up' || company.trendDirection === 'down' || company.trendDirection === 'steady'
        ? company.trendDirection
        : 'steady';

    const trendPercentValue =
      typeof company.trendPercent === 'number' && Number.isFinite(company.trendPercent)
        ? company.trendPercent
        : Number(company.trendPercent ?? 0);
    const trendPercent = Number.isFinite(trendPercentValue)
      ? Number(trendPercentValue.toFixed(1))
      : 0;

    const formattedTrend =
      direction === 'steady'
        ? 'Steady vs last month'
        : `${trendPercent >= 0 ? '+' : ''}${trendPercent}% vs last month`;

    const topDistricts = (company.topDistricts ?? [])
      .map((district) => district?.trim())
      .filter((district): district is string => !!district)
      .slice(0, 3)
      .join(', ');

    return {
      companyName: company.companyName?.trim() || 'Unnamed company',
      prescriptionCount,
      marketShare,
      topDistricts: topDistricts || 'District data pending',
      trendDirection: direction,
      trendLabel: formattedTrend,
      accentClass: this.companyAccentClasses[index % this.companyAccentClasses.length],
    };
  }

  openMedicineModal(medicine: MedicinePerformance): void {
    this.selectedMedicine = medicine;
    this.medicineModalOpen = true;
    this.divisionError = null;
    this.divisionMetrics = [];

    const medicationId = medicine.medicationId;
    if (!medicationId) {
      this.divisionError = 'Medication identifier is missing for this record.';
      return;
    }

    const cached = this.divisionCache.get(medicationId);
    if (cached) {
      this.divisionMetrics = cached;
      return;
    }

    this.divisionLoading = false;
    const dummyMetrics = this.buildDummyDivisionMetrics(medicine);

    if (dummyMetrics.length) {
      this.divisionMetrics = dummyMetrics;
      this.divisionCache.set(medicationId, dummyMetrics);
    } else {
      this.divisionError = 'Division-level data is not available for this medicine yet.';
    }
  }

  closeMedicineModal(): void {
    this.medicineModalOpen = false;
    this.selectedMedicine = null;
    this.divisionLoading = false;
    this.divisionError = null;
    this.divisionMetrics = [];
  }

  trackDivision(_index: number, metric: MedicationDivisionUsage): string {
    return metric.divisionName ?? `${_index}`;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.medicineModalOpen) {
      this.closeMedicineModal();
    }
  }

  private buildDummyDivisionMetrics(
    medicine: MedicinePerformance
  ): MedicationDivisionUsage[] {
    const divisions = [
      'Dhaka',
      'Chattogram',
      'Rajshahi',
      'Khulna',
      'Sylhet',
      'Barishal',
      'Rangpur',
      'Mymensingh',
    ];

    const templates: number[][] = [
      [0.33, 0.19, 0.13, 0.12, 0.08, 0.06, 0.05, 0.04],
      [0.28, 0.22, 0.16, 0.12, 0.1, 0.06, 0.04, 0.02],
      [0.31, 0.21, 0.14, 0.1, 0.09, 0.07, 0.05, 0.03],
    ];

    const templateIndex =
      Math.abs(medicine.medicationId ?? medicine.name.length) % templates.length;
    const selectedTemplate = templates[templateIndex];
    const totalPrescriptions =
      medicine.prescriptions > 0 ? medicine.prescriptions : 100;

    const metrics = divisions.map((division, index) => {
      const share = selectedTemplate[index] ?? 0;
      return {
        divisionName: division,
        totalPrescriptions: Math.max(
          1,
          Math.round(totalPrescriptions * share)
        ),
      };
    });

    const totalFromMetrics = metrics.reduce(
      (sum, metric) => sum + metric.totalPrescriptions,
      0
    );

    if (totalFromMetrics !== totalPrescriptions && metrics.length) {
      const difference = totalPrescriptions - totalFromMetrics;
      const adjusted =
        metrics[0].totalPrescriptions + difference;
      metrics[0].totalPrescriptions = Math.max(1, adjusted);
    }

    return metrics.filter((metric) => metric.totalPrescriptions > 0);
  }

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

  readonly demographicBreakdown: DemographicMetric[] = [
    {
      label: 'Female patients',
      total: '1,140',
      share: '53%',
      change: '+4.2% vs last month',
      icon: 'female',
      accentClass:
        'bg-[linear-gradient(135deg,#ec4899_0%,#f472b6_100%)] shadow-[0_12px_28px_rgba(236,72,153,0.25)]',
    },
    {
      label: 'Male patients',
      total: '920',
      share: '43%',
      change: '+2.8% vs last month',
      icon: 'male',
      accentClass:
        'bg-[linear-gradient(135deg,var(--brand-primary)_0%,var(--brand-primary-accent)_100%)] shadow-[0_12px_28px_rgba(6,180,139,0.25)]',
    },
    {
      label: 'Paediatric & senior',
      total: '80',
      share: '4%',
      change: '+1.1% vs last month',
      icon: 'family',
      accentClass:
        'bg-[linear-gradient(135deg,#38bdf8_0%,#60a5fa_100%)] shadow-[0_12px_28px_rgba(59,130,246,0.25)]',
    },
  ];

  readonly regionalPerformance: RegionalPerformance[] = [
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
      notableInsights: 'Digital-first clinics drove a 9% lift in chronic care renewals.',
      genderSplit: [
        { label: 'Female', percent: 56, barClass: 'from-rose-400 to-rose-500' },
        { label: 'Male', percent: 40, barClass: 'from-brand-primary to-emerald-400' },
        { label: 'Other / Undisclosed', percent: 4, barClass: 'from-indigo-400 to-sky-400' },
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
      notableInsights: 'Seaport employer partnerships added 260 new patients this cycle.',
      genderSplit: [
        { label: 'Female', percent: 48, barClass: 'from-rose-400 to-rose-500' },
        { label: 'Male', percent: 47, barClass: 'from-brand-primary to-emerald-400' },
        { label: 'Other / Undisclosed', percent: 5, barClass: 'from-indigo-400 to-sky-400' },
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
      notableInsights: 'Seasonal allergy cases peaked, nudging average prescription lengths higher.',
      genderSplit: [
        { label: 'Female', percent: 44, barClass: 'from-rose-400 to-rose-500' },
        { label: 'Male', percent: 49, barClass: 'from-brand-primary to-emerald-400' },
        { label: 'Other / Undisclosed', percent: 7, barClass: 'from-indigo-400 to-sky-400' },
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
      notableInsights: 'Cross-border clinics are fuelling respiratory consult growth.',
      genderSplit: [
        { label: 'Female', percent: 46, barClass: 'from-rose-400 to-rose-500' },
        { label: 'Male', percent: 45, barClass: 'from-brand-primary to-emerald-400' },
        { label: 'Other / Undisclosed', percent: 9, barClass: 'from-indigo-400 to-sky-400' },
      ],
    },
  ];

  selectedRegion: RegionalPerformance = this.regionalPerformance[0];

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



  readonly doctorSummaries: DoctorSummary[] = [
    {
      id: 1,
      name: 'Dr. Farhana Rahman',
      speciality: 'Endocrinology',
      region: 'Dhaka North',
      avatarInitials: 'FR',
      avatarBgClass:
        'bg-[linear-gradient(135deg,var(--brand-primary)_0%,var(--brand-primary-accent)_100%)] text-white shadow-[0_10px_24px_rgba(6,180,139,0.28)]',
      totalPrescriptions: 486,
      newPatients: 64,
      repeatRate: '82%',
    },
    {
      id: 2,
      name: 'Dr. Mahid Hasan',
      speciality: 'Cardiology',
      region: 'Chattogram',
      avatarInitials: 'MH',
      avatarBgClass:
        'bg-[linear-gradient(135deg,#38bdf8_0%,#60a5fa_100%)] text-white shadow-[0_10px_24px_rgba(59,130,246,0.25)]',
      totalPrescriptions: 432,
      newPatients: 52,
      repeatRate: '76%',
    },
    {
      id: 3,
      name: 'Dr. Nusrat Alam',
      speciality: 'Pulmonology',
      region: 'Sylhet',
      avatarInitials: 'NA',
      avatarBgClass:
        'bg-[linear-gradient(135deg,#a855f7_0%,#d8b4fe_100%)] text-white shadow-[0_10px_24px_rgba(168,85,247,0.25)]',
      totalPrescriptions: 384,
      newPatients: 47,
      repeatRate: '74%',
    },
    {
      id: 4,
      name: 'Dr. Reza Karim',
      speciality: 'General Medicine',
      region: 'Khulna',
      avatarInitials: 'RK',
      avatarBgClass:
        'bg-[linear-gradient(135deg,#f97316_0%,#fb923c_100%)] text-white shadow-[0_10px_24px_rgba(249,115,22,0.25)]',
      totalPrescriptions: 358,
      newPatients: 41,
      repeatRate: '71%',
    },
  ];

  readonly doctorDetails: Record<number, DoctorDetail> = {
    1: {
      utilisation: '94%',
      utilisationChange: '+3.6% vs last month',
      utilisationTrend: 'up',
      digitalShare: '68%',
      followUpRate: '74%',
      followUpChange: '+2.1%',
      followUpTrend: 'up',
      topMedicines: [
        { name: 'Metformin 500mg', prescriptions: 182, share: '37%' },
        { name: 'Empagliflozin 10mg', prescriptions: 128, share: '26%' },
        { name: 'Sitagliptin 50mg', prescriptions: 94, share: '19%' },
      ],
      upcomingClinics: [
        { date: 'Wed, 12 Jun', window: '15:00 – 18:00', location: 'Banani Digital Clinic' },
        { date: 'Fri, 14 Jun', window: '10:00 – 13:00', location: 'Telehealth sessions' },
      ],
      patientFeedback: {
        score: '4.8/5',
        change: '+0.3',
        positive: true,
      },
    },
    2: {
      utilisation: '89%',
      utilisationChange: '+1.8% vs last month',
      utilisationTrend: 'up',
      digitalShare: '62%',
      followUpRate: '69%',
      followUpChange: '-0.8%',
      followUpTrend: 'down',
      topMedicines: [
        { name: 'Amlodipine 5mg', prescriptions: 174, share: '33%' },
        { name: 'Losartan 50mg', prescriptions: 152, share: '29%' },
        { name: 'Atorvastatin 20mg', prescriptions: 128, share: '24%' },
      ],
      upcomingClinics: [
        { date: 'Thu, 13 Jun', window: '09:00 – 12:00', location: 'Chattogram Heart Centre' },
        { date: 'Sat, 15 Jun', window: '16:00 – 18:00', location: 'Tele-consultation block' },
      ],
      patientFeedback: {
        score: '4.6/5',
        change: '+0.1',
        positive: true,
      },
    },
    3: {
      utilisation: '87%',
      utilisationChange: '-1.4% vs last month',
      utilisationTrend: 'down',
      digitalShare: '71%',
      followUpRate: '72%',
      followUpChange: '+1.2%',
      followUpTrend: 'up',
      topMedicines: [
        { name: 'Montelukast 10mg', prescriptions: 146, share: '31%' },
        { name: 'Budesonide inhaler', prescriptions: 122, share: '26%' },
        { name: 'Salbutamol inhaler', prescriptions: 108, share: '23%' },
      ],
      upcomingClinics: [
        { date: 'Tue, 11 Jun', window: '17:00 – 20:00', location: 'Sylhet Respiratory Centre' },
        { date: 'Sat, 15 Jun', window: '11:00 – 13:00', location: 'Telehealth follow-ups' },
      ],
      patientFeedback: {
        score: '4.7/5',
        change: '-0.1',
        positive: false,
      },
    },
    4: {
      utilisation: '82%',
      utilisationChange: '+0.9% vs last month',
      utilisationTrend: 'up',
      digitalShare: '58%',
      followUpRate: '66%',
      followUpChange: '+0.6%',
      followUpTrend: 'up',
      topMedicines: [
        { name: 'Paracetamol 500mg', prescriptions: 134, share: '29%' },
        { name: 'Cefixime 200mg', prescriptions: 112, share: '24%' },
        { name: 'Pantoprazole 40mg', prescriptions: 96, share: '21%' },
      ],
      upcomingClinics: [
        { date: 'Mon, 10 Jun', window: '14:00 – 17:00', location: 'Khulna City Clinic' },
        { date: 'Thu, 13 Jun', window: '18:00 – 20:00', location: 'Virtual quick consults' },
      ],
      patientFeedback: {
        score: '4.5/5',
        change: '+0.2',
        positive: true,
      },
    },
  };




  selectedDoctorId: number = this.doctorSummaries[0]?.id ?? 0;

  get medicineLeaderboard(): MedicinePerformance[] {
    return this.medicinePerformance[this.selectedMedicinePeriod];
  }

  selectRegion(region: RegionalPerformance): void {
    this.selectedRegion = region;
  }

  trackRegionByName(_: number, region: RegionalPerformance): string {
    return region.name;
  }

  get activeDoctorSummary(): DoctorSummary | undefined {
    return this.doctorSummaries.find((doc) => doc.id === this.selectedDoctorId);
  }

  get activeDoctorDetail(): DoctorDetail | undefined {
    return this.doctorDetails[this.selectedDoctorId];
  }

  setMedicinePeriod(period: PeriodKey): void {
    this.selectedMedicinePeriod = period;
  }

  selectDoctor(id: number): void {
    this.selectedDoctorId = id;
  }

  downloadReports(): void {
    const tables: string[] = [];

    tables.push(
      this.buildTable('Summary metrics', ['Metric', 'Value', 'Insight', 'Badge'], this.summaryStats.map((stat) => [stat.label, stat.value, stat.hint, stat.badge]))
    );

    tables.push(
      this.buildTable(
        'Demographic breakdown',
        ['Segment', 'Patients', 'Share', 'Change'],
        this.demographicBreakdown.map((demo) => [demo.label, demo.total, demo.share, demo.change])
      )
    );

    tables.push(
      this.buildTable(
        'Age distribution',
        ['Age range', 'Patients', 'Percent'],
        this.ageDistribution.map((age) => [age.range, age.patients, `${age.percent}%`])
      )
    );

    tables.push(
      this.buildTable(
        'Company performance overview',
        ['Company', 'Prescriptions', 'Market share', 'Top districts', 'Trend'],
        this.companyPerformanceCards.map((company) => [
          company.companyName,
          company.prescriptionCount,
          `${company.marketShare}%`,
          company.topDistricts,
          company.trendLabel,
        ])
      )
    );

    tables.push(
      this.buildTable(
        'Regional performance deep dive',
        [
          'Region',
          'Volume share',
          'Prescriptions',
          'Unique medicines',
          'Top medicine',
          'Top medicine share',
          'Insight',
          'Gender mix',
        ],
        this.regionalPerformance.map((region) => [
          region.name,
          region.shareLabel,
          region.prescriptions,
          region.totalMedicines,
          region.topMedicine.name,
          region.topMedicine.share,
          region.notableInsights,
          region.genderSplit.map((segment) => `${segment.label}: ${segment.percent}%`).join(' | '),
        ])
      )
    );

    tables.push(
      this.buildTable(
        'Top medicines',
        ['Period', 'Medicine', 'Category', 'Prescriptions', 'Share', 'Growth', 'Trend'],
        this.periodKeys.flatMap((period) =>
          this.medicinePerformance[period].map((medicine:any) => [
            this.periodLabels[period],
            medicine.name,
            medicine.category,
            medicine.prescriptions,
            medicine.share,
            medicine.growth,
            medicine.trend,
          ])
        )
      )
    );

    tables.push(
      this.buildTable(
        'Doctor performance',
        [
          'Doctor',
          'Speciality',
          'Region',
          'Total Prescriptions',
          'New Patients',
          'Repeat Rate',
          'Utilisation',
          'Utilisation Change',
          'Digital Share',
          'Follow-up Rate',
          'Follow-up Change',
          'Top Medicines',
          'Upcoming Clinics',
          'Patient Feedback',
        ],
        this.doctorSummaries.map((summary) => {
          const detail = this.doctorDetails[summary.id];
          const topMedicines = detail?.topMedicines
            .map((item) => `${item.name} (${item.prescriptions}, ${item.share})`)
            .join(' | ');
          const upcomingClinics = detail?.upcomingClinics
            .map((clinic) => `${clinic.date} ${clinic.window} @ ${clinic.location}`)
            .join(' | ');
          const feedback = detail
            ? `${detail.patientFeedback.score} (${detail.patientFeedback.change})`
            : undefined;

          return [
            summary.name,
            summary.speciality,
            summary.region,
            summary.totalPrescriptions,
            summary.newPatients,
            summary.repeatRate,
            detail?.utilisation ?? '—',
            detail?.utilisationChange ?? '—',
            detail?.digitalShare ?? '—',
            detail?.followUpRate ?? '—',
            detail?.followUpChange ?? '—',
            topMedicines ?? '—',
            upcomingClinics ?? '—',
            feedback ?? '—',
          ];
        })
      )
    );

    tables.push(
      this.buildTable(
        'Recent updates',
        ['Message', 'Highlight', 'Time'],
        this.recentUpdates.map((update) => [update.message.trim(), update.highlight ?? '—', update.time])
      )
    );

    const workbook = this.buildWorkbook(tables.join(''));
    const blob = new Blob([workbook], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'prescriba-admin-analytics.xls';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private buildWorkbook(tableMarkup: string): string {
    return `<!DOCTYPE html><html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8" /><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Prescriba Report</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>${tableMarkup}</body></html>`;
  }

  private buildTable(title: string, headers: string[], rows: (string | number)[][]): string {
    const headerHtml = headers
      .map((header) => `<th style="background:#0f766e;color:#ffffff;padding:8px 12px;border:1px solid #0f766e;text-align:left;">${this.escapeCell(header)}</th>`)
      .join('');
    const bodyHtml = rows.length
      ? rows
          .map(
            (row) =>
              `<tr>${row
                .map(
                  (cell) =>
                    `<td style="padding:6px 10px;border:1px solid #d1d5db;vertical-align:top;">${this.escapeCell(cell)}</td>`
                )
                .join('')}</tr>`
          )
          .join('')
      : `<tr><td style="padding:6px 10px;border:1px solid #d1d5db;" colspan="${headers.length}">No data available</td></tr>`;

    return `
      <table style="border-collapse:collapse;margin:0 0 24px 0;font-family:'Segoe UI',sans-serif;font-size:12px;width:100%;">
        <caption style="caption-side:top;text-align:left;font-weight:600;font-size:14px;margin:0 0 8px 0;color:#0f172a;">${this.escapeCell(
          title
        )}</caption>
        <thead>
          <tr>${headerHtml}</tr>
        </thead>
        <tbody>${bodyHtml}</tbody>
      </table>
    `;
  }

  private escapeCell(value: string | number): string {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
