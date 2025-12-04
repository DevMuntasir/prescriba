const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const targetPath = './src/environments/environment.ts';

const envConfigFile = `export const serviceBaseUrl = '${process.env.SERVICE_BASE_URL}';
export const USER_SECRATE = '${process.env.USER_SECRATE}';
const apiUrl = '${process.env.API_URL}';
export const authenticationApi = '${process.env.AUTH_API_URL}';
export const prescriptionApi = '${process.env.PRESCRIPTION_API_URL}';

const firebaseConfig = {
  apiKey: "${process.env.FIREBASE_API_KEY}",
  authDomain: "${process.env.FIREBASE_AUTH_DOMAIN}",
  projectId: "${process.env.FIREBASE_PROJECT_ID}",
  storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${process.env.FIREBASE_APP_ID}",
  measurementId: "${process.env.FIREBASE_MEASUREMENT_ID}"
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
  apiBaseUrl: apiUrl,
  useBackendAi: ${process.env.USE_BACKEND_AI || false},
  geminiApiKey: '${process.env.GEMINI_API_KEY}',
} as const;
`;

fs.writeFile(targetPath, envConfigFile, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log(`Output generated at ${targetPath}`);
    }
});
