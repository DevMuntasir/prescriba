import { Component, Inject, OnInit } from '@angular/core';
import { RoleManagementService } from './proxy/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  loading: boolean = false;
  constructor(
    @Inject(RoleManagementService)
    private RoleManagementService: RoleManagementService
  ) {}

  ngOnInit(): void {
    const checkIsRolesExist = localStorage.getItem('roles')
      ? JSON.parse(localStorage.getItem('roles') ?? '{}')
      : null;

    if (!checkIsRolesExist) {
      this.RoleManagementService.getRolesAll().subscribe({
        next: (res) => {
          localStorage.setItem('roles', JSON.stringify(res.results));
        },
      });
    }
  }
}
