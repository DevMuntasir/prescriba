const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const targetPath = './src/assets/env.js';

const envConfigFile = `(function(window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["serviceBaseUrl"] = "${process.env.SERVICE_BASE_URL}";
  window["env"]["USER_SECRATE"] = "${process.env.USER_SECRATE}";
  window["env"]["apiUrl"] = "${process.env.API_URL}";
  window["env"]["authenticationApi"] = "${process.env.AUTH_API_URL}";
  window["env"]["prescriptionApi"] = "${process.env.PRESCRIPTION_API_URL}";
  window["env"]["firebaseApiKey"] = "${process.env.FIREBASE_API_KEY}";
  window["env"]["firebaseAuthDomain"] = "${process.env.FIREBASE_AUTH_DOMAIN}";
  window["env"]["firebaseProjectId"] = "${process.env.FIREBASE_PROJECT_ID}";
  window["env"]["firebaseStorageBucket"] = "${process.env.FIREBASE_STORAGE_BUCKET}";
  window["env"]["firebaseMessagingSenderId"] = "${process.env.FIREBASE_MESSAGING_SENDER_ID}";
  window["env"]["firebaseAppId"] = "${process.env.FIREBASE_APP_ID}";
  window["env"]["firebaseMeasurementId"] = "${process.env.FIREBASE_MEASUREMENT_ID}";
  window["env"]["geminiApiKey"] = "${process.env.GEMINI_API_KEY}";
})(this);
`;

fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log(`Output generated at ${targetPath}`);
  }
});
