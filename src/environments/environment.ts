export const serviceBaseUrl = 'http://localhost:3000';
export const USER_SECRATE = 'prescriba@@2024';
const apiUrl = 'https://steady-grateful-farms-temp.trycloudflare.com';
export const authenticationApi =
  'https://cheaper-enter-losing-copied.trycloudflare.com';
export const prescriptionApi =
  'https://outcomes-deaths-society-mozilla.trycloudflare.com';

export const environment = {
  production: false,
  application: {
    name: 'prescriba',
    logoUrl: '',
  },
  apis: {
    default: {
      url: apiUrl,
      rootNamespace: 'prescriba',
    },
  },
  localization: {
    defaultResourceName: 'prescriba',
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
