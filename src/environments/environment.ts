import { Environment } from '@abp/ng.core';

// const baseUrl = 'http://apibetasoowgood.com';
// const apiUrl = 'https://apisoowgoodbeta.com';

// const apiUrl = 'https://localhost:44339';

export const serviceBaseUrl = 'http://localhost:3000';
export const USER_SECRATE = 'soowgood@@2024';
const apiUrl = 'https://steady-grateful-farms-temp.trycloudflare.com';
export const authenticationApi =
  'https://cheaper-enter-losing-copied.trycloudflare.com';
export const prescriptionApi =
  'https://outcomes-deaths-society-mozilla.trycloudflare.com';
export const environment = {
  production: false,
  application: {
    name: 'SoowGoodWeb',
    logoUrl: '',
  },
  oAuthConfig: {
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

  localization: {
    defaultResourceName: 'SoowGoodWeb',
    languages: [
      {
        cultureName: 'en',
        uiCultureName: 'en',
        displayName: 'English',
        flagIcon: 'famfamfam-flags gb',
        isDefault: true,
      },
    ],
  },

  // firebaseConfig: {
  //   apiKey: 'AIzaSyDr1_ViD_J8b3tI1jPrIf91rXaVq8xwW2E',
  //   authDomain: 'mychat-6d0fd.firebaseapp.com',
  //   projectId: 'mychat-6d0fd',
  //   storageBucket: 'mychat-6d0fd.appspot.com',
  //   messagingSenderId: '160782442286',
  //   appId: '1:160782442286:web:c28bcb58a60dce3c8764bf',
  //   vapidKey:
  //     'BJAlGQjs4DpCkt48HX2UUI4QHWr3qdDB38BxbfZtfPgUAS0L5OQjjYEBhh_wYZ8sqgfPRbm3tHs8gT10KOKu7tI',
  // },
} as Environment;
