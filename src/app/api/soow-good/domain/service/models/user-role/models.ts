
export interface UserRoleResponseDto {
  id?: string;
  tenantId?: string;
  name?: string;
  normalizedName?: string;
  isDefault: boolean;
  isStatic: boolean;
  isPublic: boolean;
  entityVersion: number;
  extraProperties?: string;
  concurrencyStamp?: string;
}
