import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getCurrentSchedule, getTodayStats } from './mock-data';


@Component({
  selector: 'app-e-chamber',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './e-chamber.component.html',
  styleUrls: ['./e-chamber.component.scss'],
})
export class EChamberComponent implements OnInit {
  currentTime: Date = new Date();
  schedule = getCurrentSchedule();
  stats = getTodayStats();

  private timer: any;

  ngOnInit() {
    this.timer = setInterval(() => {
      this.currentTime = new Date();
      this.schedule = getCurrentSchedule();
      this.stats = getTodayStats();
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  trackById(index: number, item: any) {
    return item.id;
  }
}