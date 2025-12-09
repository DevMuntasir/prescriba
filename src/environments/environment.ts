const env = (window as any).env || {};

export const serviceBaseUrl = env.serviceBaseUrl || '';
export const USER_SECRATE = env.USER_SECRATE || '';
const apiUrl = env.apiUrl || '';
export const authenticationApi = env.authenticationApi || '';
export const prescriptionApi = env.prescriptionApi || '';

const firebaseConfig = {
  apiKey: env.firebaseApiKey || '',
  authDomain: env.firebaseAuthDomain || '',
  projectId: env.firebaseProjectId || '',
  storageBucket: env.firebaseStorageBucket || '',
  messagingSenderId: env.firebaseMessagingSenderId || '',
  appId: env.firebaseAppId || '',
  measurementId: env.firebaseMeasurementId || ''
};

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
  firebase: firebaseConfig,
  geminiApiKey: env.geminiApiKey || '',
} as const;
