importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDr1_ViD_J8b3tI1jPrIf91rXaVq8xwW2E",
  authDomain: "mychat-6d0fd.firebaseapp.com",
  projectId: "mychat-6d0fd",
  storageBucket: "mychat-6d0fd.appspot.com",
  messagingSenderId: "160782442286",
  appId: "1:160782442286:web:c28bcb58a60dce3c8764bf",
});

const messaging = firebase.messaging();
