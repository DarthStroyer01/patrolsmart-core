import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// functions/index.js

const functions = require('firebase-functions');
const admin     = require('firebase-admin');
admin.initializeApp();

exports.deleteUser = functions.https.onCall(async (data, context) => {
  // 1. Must be logged in
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Login required');
  }
  // 2. Must be admin or superAdmin
  const callerSnap = await admin.firestore().doc(`users/${context.auth.uid}`).get();
  const callerRole = callerSnap.data()?.role;
  if (!['admin','superAdmin'].includes(callerRole)) {
    throw new functions.https.HttpsError('permission-denied', 'Insufficient permissions');
  }
  // 3. Delete Auth user
  const uidToDelete = data.uid;
  await admin.auth().deleteUser(uidToDelete);
  return { success: true };
});
