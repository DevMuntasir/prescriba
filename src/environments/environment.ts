export const serviceBaseUrl = 'http://localhost:3000';
export const USER_SECRATE = 'prescriba@@2024';
const apiUrl = 'https://permits-move-sacrifice-classics.trycloudflare.com';
export const authenticationApi =
  'https://sarah-holmes-employees-therefore.trycloudflare.com';
export const prescriptionApi =
  'https://dimension-compiler-fair-consequently.trycloudflare.com';

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
