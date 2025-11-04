export const serviceBaseUrl = 'http://localhost:3000';
export const USER_SECRATE = 'prescriba@@2024';
const apiUrl = 'http://103.125.255.81:5001';
export const authenticationApi =
  'http://103.125.255.81:5003';
export const prescriptionApi =
  'http://103.125.255.81:5002';

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
