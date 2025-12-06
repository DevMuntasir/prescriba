(function (window) {
    window.env = window.env || {};

    // Environment variables
    window["env"]["serviceBaseUrl"] = "${SERVICE_BASE_URL}";
    window["env"]["USER_SECRATE"] = "${USER_SECRATE}";
    window["env"]["apiUrl"] = "${API_URL}";
    window["env"]["authenticationApi"] = "${AUTH_API_URL}";
    window["env"]["prescriptionApi"] = "${PRESCRIPTION_API_URL}";
    window["env"]["firebaseApiKey"] = "${FIREBASE_API_KEY}";
    window["env"]["firebaseAuthDomain"] = "${FIREBASE_AUTH_DOMAIN}";
    window["env"]["firebaseProjectId"] = "${FIREBASE_PROJECT_ID}";
    window["env"]["firebaseStorageBucket"] = "${FIREBASE_STORAGE_BUCKET}";
    window["env"]["firebaseMessagingSenderId"] = "${FIREBASE_MESSAGING_SENDER_ID}";
    window["env"]["firebaseAppId"] = "${FIREBASE_APP_ID}";
    window["env"]["firebaseMeasurementId"] = "${FIREBASE_MEASUREMENT_ID}";
    window["env"]["geminiApiKey"] = "${GEMINI_API_KEY}";
})(this);
