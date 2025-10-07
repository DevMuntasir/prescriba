import { Environment } from '@abp/ng.core';

const baseUrl = 'http://apibetasoowgood.com';
const apiUrl = 'http://apibetasoowgood.com';
const issuerUrl = 'https://authsoowgoodbeta.com';
export const serviceBaseUrl = 'http://localhost:3000'; //
export const USER_SECRATE = 'soowgood@@2024';
export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'SoowGoodWeb',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: issuerUrl,
    redirectUri: baseUrl,
    clientId: 'SoowGoodWeb_App',
    responseType: 'code',
    scope: 'offline_access openid profile role email phone SoowGoodWeb',
    requireHttps: true,
  },
  apis: {
    default: {
      url: apiUrl,
      rootNamespace: 'SoowGoodWeb',
    },
  },
} as Environment;
