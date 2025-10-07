import { AuthModel } from '../auth-models/auth.model';

export class UserProfile {
  at_hash?: string;
  aud?: string;
  auth_time?: number;
  email?: string;
  email_verified?: string;
  exp?: number;
  given_name?: string;
  iat?: number;
  idp?: string;
  iss?: string;
  name?: string;
  nbf?: number;
  nonce?: string;
  phone_number_verified?: string;
  preferred_username?: string;
  role?: string;
  s_hash?: string;
  sid?: string;
  sub?: string;
}

export class UserModel extends AuthModel {
  at_hash?: string;
  aud?: string;
  auth_time?: number;
  email?: string;
  email_verified?: string;
  exp?: number;
  given_name?: string;
  iat?: number;
  idp?: string;
  iss?: string;
  name?: string;
  nbf?: number;
  nonce?: string;
  phone_number_verified?: string;
  preferred_username?: string;
  role?: string;
  s_hash?: string;
  sid?: string;
  sub?: string;
  pic?: string;
  roles?: string[];
  fullname?: string;
  password?: string;

  setUser(user: any) {
    if (user && user.info) {
      this.name = user.info.name || '';
      this.given_name = user.info.given_name || '';
      this.fullname = user.info.preferred_username || user.info.name;
      this.email = user.info.email || '';
      this.email_verified = user.info.email_verified || 'False';
      this.phone_number_verified = user.info.phone_number_verified || 'False';
      this.pic = user.info.pic || './assets/media/avatars/default.jpg';
      this.roles = [user.info.role] || [];
      this.sub = user.info.sub;
    }
  }
}
