export const serviceBaseUrl = 'http://localhost:3000';
export const USER_SECRATE = 'soowgood@@2024';
const apiUrl = 'https://steady-grateful-farms-temp.trycloudflare.com';
export const authenticationApi =
  'https://cheaper-enter-losing-copied.trycloudflare.com';
export const prescriptionApi =
  'https://outcomes-deaths-society-mozilla.trycloudflare.com';

export const environment = {
  production: true,
  application: {
    name: 'SoowGoodWeb',
    logoUrl: '',
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
} as const;
