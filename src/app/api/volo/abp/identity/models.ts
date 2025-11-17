export interface IdentityUser {
  id?: string;
  tenantId?: string;
  userName?: string;
  normalizedUserName?: string;
  name?: string;
  surname?: string;
  email?: string;
  normalizedEmail?: string;
  emailConfirmed?: boolean;
  passwordHash?: string;
  securityStamp?: string;
  isExternal?: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed?: boolean;
  isActive?: boolean;
  twoFactorEnabled?: boolean;
  lockoutEnd?: string;
  lockoutEnabled?: boolean;
  accessFailedCount?: number;
  shouldChangePasswordOnNextLogin?: boolean;
}
