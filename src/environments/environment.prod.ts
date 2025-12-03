export const serviceBaseUrl = 'http://localhost:3000';
export const USER_SECRATE = 'prescriba@@2024';
const apiUrl = 'https://steady-grateful-farms-temp.trycloudflare.com';
export const authenticationApi =
  'https://cheaper-enter-losing-copied.trycloudflare.com';
export const prescriptionApi =
  'https://outcomes-deaths-society-mozilla.trycloudflare.com';

export const firebaseConfig = {
  apiKey: 'YOUR_FIREBASE_API_KEY',
  authDomain: 'YOUR_FIREBASE_AUTH_DOMAIN',
  projectId: 'YOUR_FIREBASE_PROJECT_ID',
  storageBucket: 'YOUR_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'YOUR_FIREBASE_APP_ID',
};

export const environment = {
  production: true,
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
  apiBaseUrl: apiUrl,
  useBackendAi: true,
  geminiApiKey: '',
} as const;
