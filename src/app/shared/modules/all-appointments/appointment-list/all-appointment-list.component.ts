import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { AppointmentDto } from 'src/app/proxy/dto-models';
import { AppointmentCard } from '../appointment-card/appointment-card.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'appointments',
  standalone: true,

  imports: [CommonModule, AppointmentCard, InfiniteScrollDirective],
  templateUrl: './all-appointment-list.component.html',
  styleUrl: './all-appointment-list.component.scss',
  hostDirectives: [InfiniteScrollDirective],
  host: {
    '(window:scroll)': 'onScroll()',
  },
})
export class AllAppointmentListComponent {
  @Input() appointmentList: AppointmentDto[] = [] as AppointmentDto[];
  @Input() skelton: boolean = false;
  @Input() user = '';
  @Output() completeAppointment = new EventEmitter<string>();
  @Output() cancelAppointment = new EventEmitter<AppointmentDto>();
  @Output() onScrollDown = new EventEmitter<void>();
  array = [];
  sum = 100;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = '';
  modalOpen = false;

  constructor() {}
  @ViewChild('scrollContainer') scrollContainerRef!: ElementRef;
}
