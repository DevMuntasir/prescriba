import { Component, Input, OnInit, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  imports: [CommonModule, RouterModule, FormsModule, MenuItemComponent],
  standalone: true,
})
export class DashboardMenuComponent implements OnInit {
  @Input() menuList: any = [];
  collapsed = false;
  private autoCollapsed = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.updateCollapseState(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    const width = (event.target as Window).innerWidth;
    this.updateCollapseState(width);
  }

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
    this.autoCollapsed = false;
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  private updateCollapseState(width: number): void {
    if (width < 1280) {
      this.collapsed = true;
      this.autoCollapsed = true;
    } else if (this.autoCollapsed) {
      this.collapsed = false;
      this.autoCollapsed = false;
    }
  }

  logout(): void {
    this.authService.signOut().subscribe();
  }
}