import { Component, Input } from '@angular/core';
import { DashboardStateDto } from 'src/app/proxy/dto-models';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
})
export class StatsComponent {
  @Input() details: DashboardStateDto = {} as DashboardStateDto;
}
