import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalIconComponent } from '../../shared/dynamic-modal/icons/modal-icon/modal-icon.component';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule, ModalIconComponent],
  templateUrl: './section.component.html',
  styleUrl: './section.component.scss',
})
export class SectionComponent {
  @Input() title: string = '';
  @Input() items: any[] = [];
  @Output() buttonClick: EventEmitter<void> = new EventEmitter();
  @Input() fields: string[] = [];

  formatItem(item: any): string {
    return this.fields.map((field) => item[field] || '').join('  ');
  }
}
