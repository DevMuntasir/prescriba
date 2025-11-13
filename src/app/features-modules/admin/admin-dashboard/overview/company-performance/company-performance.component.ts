import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import {
  AdminPrescriptionService,
  CompanyMarketShareSegment,
  CompanyMedicineLeader,
  CompanyPerformanceInsightsResponse,
  CompanyPerformanceSummary,
  CompanyPerformanceTrendPoint,
  CompanyPerformanceTrendSeries,
} from '../../../services/admin.prescription.service';

interface MarketShareSegmentView {
  readonly label: string;
  readonly percent: number;
  readonly color: string;
}

interface CompanySummaryView {
  readonly companyName: string;
  readonly prescriptionCount: number;
  readonly marketSharePercent: number;
  readonly topDistricts: string;
  readonly trendDirection: 'up' | 'down' | 'steady';
  readonly trendLabel: string;
}

interface MedicineLeaderView {
  readonly medicineName: string;
  readonly leadingCompany: string;
  readonly prescriptionCount: number;
  readonly marketSharePercent?: number;
  readonly barWidth: number;
  readonly color: string;
}

interface TrendSeriesView {
  readonly companyName: string;
  readonly color: string;
  readonly points: string;
  readonly values: ReadonlyArray<{ period: string; value: number }>;
}

const CHART_COLORS = [
  '#0f766e',
  '#14b8a6',
  '#38bdf8',
  '#a855f7',
  '#f97316',
  '#f43f5e',
  '#6366f1',
  '#10b981',
];

@Component({
  selector: 'app-company-performance',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './company-performance.component.html',
  styleUrls: ['./company-performance.component.scss'],
})
export class CompanyPerformanceComponent implements OnInit {
  private readonly adminPrescriptionService = inject(AdminPrescriptionService);

  loading = false;
  error: string | null = null;

  summaries: CompanySummaryView[] = [];
  marketShareSegments: MarketShareSegmentView[] = [];
  marketShareGradient = 'conic-gradient(#14b8a6 0deg 360deg)';
  marketShareTotalPercent = 0;
  medicineLeaders: MedicineLeaderView[] = [];
  trendSeries: TrendSeriesView[] = [];
  trendPeriods: string[] = [];

  ngOnInit(): void {
    this.loadInsights();
  }

  trackSummary(_index: number, summary: CompanySummaryView): string {
    return summary.companyName;
  }

  trackMarketShare(_index: number, segment: MarketShareSegmentView): string {
    return segment.label;
  }

  trackMedicineLeader(_index: number, leader: MedicineLeaderView): string {
    return `${leader.medicineName}-${leader.leadingCompany}`;
  }

  trackTrendSeries(_index: number, series: TrendSeriesView): string {
    return series.companyName;
  }

  onRefresh(): void {
    this.loadInsights();
  }

  private loadInsights(): void {
    this.loading = true;
    this.error = null;

    this.adminPrescriptionService
      .getCompanyPerformanceInsights()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => this.handleResponse(response),
        error: () => {
          this.error = 'Unable to fetch company performance insights right now.';
          this.resetData();
        },
      });
  }

  private handleResponse(response: CompanyPerformanceInsightsResponse | null | undefined): void {
    const summaries = response?.summary ?? [];
    const marketShare = response?.marketShare ?? [];
    const leadingMedicines = response?.leadingMedicines ?? [];
    const trends = response?.trends ?? [];

    if (!summaries.length && !marketShare.length && !leadingMedicines.length && !trends.length) {
      this.resetData();
      this.error =
        response?.message ??
        'No company performance insights are available yet. Please try again later.';
      return;
    }

    this.summaries = summaries.map((summary) => this.mapSummary(summary));
    this.marketShareSegments = this.mapMarketShareSegments(marketShare);
    this.marketShareGradient = this.buildMarketShareGradient(this.marketShareSegments);
    this.marketShareTotalPercent = this.marketShareSegments.reduce(
      (sum, segment) => sum + segment.percent,
      0
    );
    this.medicineLeaders = this.mapMedicineLeaders(leadingMedicines);
    this.buildTrendSeries(trends);
  }

  private resetData(): void {
    this.summaries = [];
    this.marketShareSegments = [];
    this.marketShareGradient = 'conic-gradient(#d1fae5 0deg 360deg)';
    this.marketShareTotalPercent = 0;
    this.medicineLeaders = [];
    this.trendSeries = [];
    this.trendPeriods = [];
  }

  private mapSummary(summary: CompanyPerformanceSummary): CompanySummaryView {
    const prescriptionCount =
      typeof summary.prescriptionCount === 'number' && Number.isFinite(summary.prescriptionCount)
        ? summary.prescriptionCount
        : 0;
    const marketShare =
      typeof summary.marketSharePercent === 'number' && Number.isFinite(summary.marketSharePercent)
        ? Number(summary.marketSharePercent.toFixed(2))
        : 0;
    const direction =
      summary.trendDirection === 'up' || summary.trendDirection === 'down' || summary.trendDirection === 'steady'
        ? summary.trendDirection
        : 'steady';
    const trendPercentValue =
      typeof summary.trendPercent === 'number' && Number.isFinite(summary.trendPercent)
        ? summary.trendPercent
        : Number(summary.trendPercent ?? 0);
    const trendPercent = Number.isFinite(trendPercentValue)
      ? Number(trendPercentValue.toFixed(1))
      : 0;
    const trendLabel =
      direction === 'steady'
        ? 'Steady vs last month'
        : `${trendPercent >= 0 ? '+' : ''}${trendPercent}% vs last month`;

    const topDistricts = (summary.topDistricts ?? [])
      .map((district) => district?.trim())
      .filter((district): district is string => !!district)
      .slice(0, 5)
      .join(', ');

    return {
      companyName: summary.companyName?.trim() || 'Unnamed company',
      prescriptionCount,
      marketSharePercent: marketShare,
      topDistricts: topDistricts || 'District data pending',
      trendDirection: direction,
      trendLabel,
    };
  }

  private mapMarketShareSegments(
    segments: CompanyMarketShareSegment[]
  ): MarketShareSegmentView[] {
    if (!segments.length) {
      return [];
    }

    return segments.map((segment, index) => {
      const percentValue =
        typeof segment.marketSharePercent === 'number' && Number.isFinite(segment.marketSharePercent)
          ? segment.marketSharePercent
          : Number(segment.marketSharePercent ?? 0);
      const percent = Number.isFinite(percentValue)
        ? Math.max(0, Number(percentValue.toFixed(2)))
        : 0;

      return {
        label: segment.companyName?.trim() || `Company ${index + 1}`,
        percent,
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
    });
  }

  private buildMarketShareGradient(segments: MarketShareSegmentView[]): string {
    if (!segments.length) {
      return 'conic-gradient(#d1fae5 0deg 360deg)';
    }

    let current = 0;
    const stops: string[] = [];

    segments.forEach((segment) => {
      const sweep = Math.min(100, Math.max(0, segment.percent)) * 3.6;
      const start = current;
      const end = current + sweep;
      stops.push(`${segment.color} ${start}deg ${end}deg`);
      current = end;
    });

    if (current < 360) {
      stops.push(`#e2e8f0 ${current}deg 360deg`);
    }

    return `conic-gradient(${stops.join(', ')})`;
  }

  private mapMedicineLeaders(leaders: CompanyMedicineLeader[]): MedicineLeaderView[] {
    if (!leaders.length) {
      return [];
    }

    const maxCount = leaders.reduce((max, leader) => {
      const value =
        typeof leader.prescriptionCount === 'number' && Number.isFinite(leader.prescriptionCount)
          ? leader.prescriptionCount
          : 0;
      return Math.max(max, value);
    }, 0);

    return leaders.map((leader, index) => {
      const prescriptionCount =
        typeof leader.prescriptionCount === 'number' && Number.isFinite(leader.prescriptionCount)
          ? leader.prescriptionCount
          : 0;
      const marketShare =
        typeof leader.marketSharePercent === 'number' && Number.isFinite(leader.marketSharePercent)
          ? Number(leader.marketSharePercent.toFixed(2))
          : undefined;
      const width = maxCount > 0 ? Math.max(4, (prescriptionCount / maxCount) * 100) : 4;

      return {
        medicineName: leader.medicineName?.trim() || `Medicine ${index + 1}`,
        leadingCompany: leader.leadingCompany?.trim() || 'Not specified',
        prescriptionCount,
        marketSharePercent: marketShare,
        barWidth: Math.min(100, width),
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
    });
  }

  private buildTrendSeries(seriesList: CompanyPerformanceTrendSeries[]): void {
    if (!seriesList.length) {
      this.trendSeries = [];
      this.trendPeriods = [];
      return;
    }

    const periodSet = new Set<string>();
    seriesList.forEach((series) =>
      series.points?.forEach((point) => periodSet.add(point.period))
    );
    const periods = Array.from(periodSet);

    this.trendPeriods = periods;

    const maxValue = seriesList.reduce((max, series) => {
      const seriesMax = series.points?.reduce((innerMax, point) => {
        const value =
          typeof point.prescriptionCount === 'number' && Number.isFinite(point.prescriptionCount)
            ? point.prescriptionCount
            : 0;
        return Math.max(innerMax, value);
      }, 0);
      return Math.max(max, seriesMax ?? 0);
    }, 0);

    const safeMax = maxValue > 0 ? maxValue : 1;

    this.trendSeries = seriesList.map((series, index) =>
      this.mapTrendSeries(series, index, periods, safeMax)
    );
  }

  private mapTrendSeries(
    series: CompanyPerformanceTrendSeries,
    index: number,
    periods: string[],
    maxValue: number
  ): TrendSeriesView {
    const color = CHART_COLORS[index % CHART_COLORS.length];
    const periodCount = periods.length || 1;

    const values = periods.map((period) => {
      const point = this.findTrendPoint(series.points ?? [], period);
      const value =
        typeof point?.prescriptionCount === 'number' && Number.isFinite(point.prescriptionCount)
          ? point.prescriptionCount
          : 0;
      return { period, value };
    });

    const coordinates = values.map((entry, idx) => {
      const x =
        periodCount > 1 ? (idx / (periodCount - 1)) * 100 : 50;
      const normalized = maxValue > 0 ? entry.value / maxValue : 0;
      const y = 100 - normalized * 100;
      return `${x},${y}`;
    });

    return {
      companyName: series.companyName?.trim() || `Company ${index + 1}`,
      color,
      points: coordinates.join(' '),
      values,
    };
  }

  private findTrendPoint(
    points: CompanyPerformanceTrendPoint[],
    period: string
  ): CompanyPerformanceTrendPoint | undefined {
    return points.find((point) => point.period === period);
  }
}
