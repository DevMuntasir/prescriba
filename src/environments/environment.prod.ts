export const serviceBaseUrl = (window as any).env.serviceBaseUrl;
export const USER_SECRATE = (window as any).env.USER_SECRATE;
const apiUrl = (window as any).env.apiUrl;
export const authenticationApi = (window as any).env.authenticationApi;
export const prescriptionApi = (window as any).env.prescriptionApi;

export const firebaseConfig = {
  apiKey: (window as any).env.firebaseApiKey,
  authDomain: (window as any).env.firebaseAuthDomain,
  projectId: (window as any).env.firebaseProjectId,
  storageBucket: (window as any).env.firebaseStorageBucket,
  messagingSenderId: (window as any).env.firebaseMessagingSenderId,
  appId: (window as any).env.firebaseAppId,
  measurementId: (window as any).env.firebaseMeasurementId
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
