import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ApiResponseList } from '../core/generic-models/models';
import type { UserRoleResponseDto } from '../soow-good/domain/service/models/user-role/models';

@Injectable({
  providedIn: 'root',
})
export class RoleManagementService {
  apiName = 'Default';
  

  getAllRoles = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApiResponseList<UserRoleResponseDto>>({
      method: 'GET',
      url: '/api/app/role-management/roles',
    },
    { apiName: this.apiName,...config });
  

  getRolesAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ApiResponseList<UserRoleResponseDto>>({
      method: 'GET',
      url: '/api/app/role-management/roles-all',
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
