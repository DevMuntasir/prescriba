export const serviceBaseUrl = 'http://localhost:3000';
export const USER_SECRATE = 'prescriba@@2024';
const apiUrl = 'http://103.125.255.81:5001';
export const authenticationApi =
  'http://103.125.255.81:5003';
export const prescriptionApi =
  'http://103.125.255.81:5002';

const firebaseConfig = {
  apiKey: "AIzaSyDgGxETAbT-oRu_RewaNHeoEJGqU49hMyU",
  authDomain: "prescriptobd-dac94.firebaseapp.com",
  projectId: "prescriptobd-dac94",
  storageBucket: "prescriptobd-dac94.firebasestorage.app",
  messagingSenderId: "302266124373",
  appId: "1:302266124373:web:509f5caba085710b2cacdc",
  measurementId: "G-DDGD4G0L2T"
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
  geminiApiKey: 'AIzaSyC6ncGtjROXQPHeGXNVY6WJps1hxGzJsHw',
} as const;
