import type { UserRoleResponseDto } from '../user-role/models';

export interface SendOtpModel {
  userName?: string;
  roleId?: string;
  type: number;
}

export interface UserSignInRequestDto {
  userName?: string;
  password?: string;
  userLoginType?: number;
}

export interface UserSignInReturnDto {
  id?: string;
  tenantId?: string;
  userName?: string;
  normalizedUserName?: string;
  name?: string;
  surname?: string;
  email?: string;
  normalizedEmail?: string;
  emailConfirmed: boolean;
  passwordHash?: string;
  securityStamp?: string;
  isExternal: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
  isActive: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd?: string;
  lockoutEnabled: boolean;
  accessFailedCount: number;
  shouldChangePasswordOnNextLogin: boolean;
  entityVersion: number;
  lastPasswordChangeTime?: string;
  extraProperties?: string;
  concurrencyStamp?: string;
  creationTime?: string;
  creatorId?: string;
  lastModificationTime?: string;
  lastModifierId?: string;
  isDeleted: boolean;
  deleterId?: string;
  deletionTime?: string;
  info: UserRoleResponseDto;
  isVerifiedOrgCode: boolean;
  isPolicePortalTransfer: boolean;
}

export interface OrganizationValidityDto {
  userCode: 'string';
  campaignId: 0;
  isUsed: true;
  usedByUserId: '3fa85f64-5717-4562-b3fc-2c963f66afa6';
}
export interface OrganizationValidateRequestDto {
  organizationId: string | number;
  userId: string;
}

export interface UserSingupRequestDto {
  userName?: string;
  name?: string;
  surname?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  roleId?: string;
}

export interface SaveSendOtpModel extends SendOtpModel {
  otp: number;
}
