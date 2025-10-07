import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-statisticscard',
  templateUrl: './dashboard-statisticscard.component.html',
  styleUrls: ['./dashboard-statisticscard.component.scss']
})
export class DashboardStatisticscardComponent {
@Input() details: any
}
