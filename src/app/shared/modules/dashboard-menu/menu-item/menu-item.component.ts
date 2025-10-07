import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-item.component.html',
})
export class MenuItemComponent {
  @Input() href: string = '';
  @Input() iconSvg: string = '';
  @Input() label: string = '';
  @Input() count?: number;
  @Input() active: boolean = false;
  @Input() collapsed: boolean = false;
}
