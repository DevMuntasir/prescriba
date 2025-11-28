import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DayShorterPipe } from '../../../pipe/day-shorter.pipe';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-doctor-info',
  standalone: true,
  imports: [
    CommonModule,
    DayShorterPipe,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './doctor-info.component.html',
  styleUrl: './doctor-info.component.scss',
})
export class DoctorInfoComponent implements OnChanges {
  @Input() doctor: any;
  @Input() isPreHand = false;
  @Input() isHeader = true;

  experience!: SafeHtml;   // <-- will hold sanitized HTML

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['doctor']) {
      this.doctor = changes['doctor'].currentValue;
      this.experience = this.toDangerousHtml(this.doctor?.expertise || '');
    }
  }

  private toDangerousHtml(htmlStr: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(htmlStr);
  }
}
